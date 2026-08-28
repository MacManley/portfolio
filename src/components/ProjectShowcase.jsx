import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TbArrowUpRight, TbMapPin } from 'react-icons/tb';
import { statusLabels, statusClassMap, techIconMap } from '../data/projectsData';
import { staggerContainer, staggerItem } from '../motion/variants';
import CoverflowCarousel from './CoverflowCarousel';
import ProjectCover from './ProjectCover';
import ProjectModal from './ProjectModal';
import './ProjectShowcase.css';

// The preview panel only has room for one row of icons — the rest collapse.
const MAX_VISIBLE_TECH = 6;

// How much of the gap to the cursor the panel closes each frame. Lower = laggier.
const FOLLOW_FACTOR = 0.15;

// Breathing room kept between the panel and the window edges.
const EDGE_MARGIN = 12;

const formatYear = (year) => {
    if (!Array.isArray(year)) return `${year}`;
    if (year.length === 0) return '';
    const first = Math.min(...year);
    const last = Math.max(...year);
    return first === last ? `${first}` : `${first}–${last}`;
};

// A multi-year project belongs to the year it started, so that's its sort key.
const startYear = (project) => (Array.isArray(project.year) ? Math.min(...project.year) : project.year);

function TechIcons({ project, limit }) {
    const sorted = [...project.technologyUsed].sort();
    const shown = limit ? sorted.slice(0, limit) : sorted;
    const overflow = sorted.length - shown.length;

    return (
        <div className="tech-icons">
            {shown.map((tech, techIndex) => (
                <span key={techIndex} className="tech-icon" title={tech}>
                    {techIconMap[tech] || tech}
                </span>
            ))}
            {overflow > 0 && (
                <span className="tech-icon tech-icon-more" title={sorted.slice(limit).join(', ')}>
                    +{overflow}
                </span>
            )}
        </div>
    );
}

/**
 * A floating cover that trails the cursor, easing toward it a fixed fraction per
 * frame. The pointer position lives in a ref and the transform is written
 * straight to the node: a re-render per mousemove would drop frames on the list
 * behind it, and the eased position is not something anything else reads.
 */
function CursorPreview({ projects, activeIndex }) {
    const panelRef = useRef(null);
    const innerRef = useRef(null);
    const target = useRef({ x: 0, y: 0 });
    const current = useRef({ x: 0, y: 0 });
    const seeded = useRef(false);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = null;

        const handleMove = (event) => {
            target.current = { x: event.clientX, y: event.clientY };
            // First sighting of the cursor: land the panel on it rather than
            // gliding in from the top-left corner of the window.
            if (!seeded.current) {
                current.current = { ...target.current };
                seeded.current = true;
            }
        };

        // The panel is offset from the cursor by CSS margins, so it can hang off
        // the window near an edge — pull the followed point back in far enough
        // that the panel itself stays fully on screen.
        const clamp = (point) => {
            const inner = innerRef.current;
            if (!inner) return point;

            const width = inner.offsetWidth;
            const height = inner.offsetHeight;
            const style = window.getComputedStyle(inner);
            const offsetX = parseFloat(style.marginLeft) || 0;
            const offsetY = parseFloat(style.marginTop) || 0;

            const maxX = window.innerWidth - width - offsetX - EDGE_MARGIN;
            const minY = EDGE_MARGIN - offsetY;
            const maxY = window.innerHeight - height - offsetY - EDGE_MARGIN;

            return {
                x: Math.min(point.x, Math.max(EDGE_MARGIN, maxX)),
                y: Math.min(Math.max(point.y, minY), Math.max(minY, maxY)),
            };
        };

        const tick = () => {
            const factor = media.matches ? 1 : FOLLOW_FACTOR;
            const goal = clamp(target.current);
            current.current = {
                x: current.current.x + (goal.x - current.current.x) * factor,
                y: current.current.y + (goal.y - current.current.y) * factor,
            };

            if (panelRef.current) {
                panelRef.current.style.transform =
                    `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
            }

            frame = requestAnimationFrame(tick);
        };

        window.addEventListener('pointermove', handleMove, { passive: true });
        frame = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('pointermove', handleMove);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    const active = activeIndex === null ? null : projects[activeIndex];

    return (
        <div className="showcase-preview" ref={panelRef} aria-hidden="true">
            <div className={`showcase-preview-inner${active ? ' is-visible' : ''}`} ref={innerRef}>
                <div className="showcase-preview-stack">
                    {/* Every cover stays mounted so switching rows never waits on a
                        decode — only opacity changes. */}
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`showcase-preview-slide${activeIndex === index ? ' is-active' : ''}`}
                        >
                            <ProjectCover project={project}>
                                <span className={`showcase-preview-status ${statusClassMap[project.status] || ''}`}>
                                    {statusLabels[project.status]}
                                </span>
                            </ProjectCover>
                        </div>
                    ))}
                </div>

                <div className="showcase-preview-caption">
                    {active && <TechIcons project={active} limit={MAX_VISIBLE_TECH} />}
                </div>
            </div>
        </div>
    );
}

function ProjectShowcase({ projects = [], categoryFilter = 'All' }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [markdownCache, setMarkdownCache] = useState({});
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [featured, setFeatured] = useState(null);
    const loadingPromises = useRef({});

    // Array.prototype.sort is stable, so the curated data order breaks year ties.
    const sorted = useMemo(() => [...projects].sort((a, b) => startYear(b) - startYear(a)), [projects]);
    const noProjects = sorted.length === 0;

    // A filter change can unmount the hovered row without a mouseleave firing.
    useEffect(() => {
        setHoveredIndex(null);
    }, [categoryFilter]);

    const prefetchImages = (content) => {
        const regex = /!\[[^\]]*\]\(([^)]+)\)/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            const img = new Image();
            img.src = match[1];
        }
    };

    const prefetchProject = (project) => {
        if (markdownCache[project.id] || loadingPromises.current[project.id]) {
            return;
        }

        const promise = fetch(`/data/${project.id}.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Markdown file not found');
                }
                return response.text();
            })
            .then(content => {
                setMarkdownCache(prev => ({ ...prev, [project.id]: content }));
                prefetchImages(content);
            })
            .catch(err => console.warn('Prefetch failed', err))
            .finally(() => {
                delete loadingPromises.current[project.id];
            });

        loadingPromises.current[project.id] = promise;
    };

    // The carousel calls this from an effect, so it has to keep the same
    // identity across renders — the live prefetch closure rides in on a ref.
    const prefetchRef = useRef(prefetchProject);
    prefetchRef.current = prefetchProject;

    const handleFocusSlide = useCallback((project) => {
        setFeatured(project);
        prefetchRef.current(project);
    }, []);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleModalCloseComplete = () => {
        setSelectedProject(null);
    };

    return (
        <div className="showcase">
            {noProjects ? (
                <div className="no-projects">
                    <p>Nothing matches that filter yet. Try another category.</p>
                </div>
            ) : (
                <>
                    <CursorPreview projects={sorted} activeIndex={hoveredIndex} />

                    {/* Remounted per filter: the ring's position is an index into
                        this exact list, so a changed list needs a fresh one. */}
                    <CoverflowCarousel
                        key={categoryFilter}
                        slides={sorted}
                        onActivate={handleProjectClick}
                        onFocusSlide={handleFocusSlide}
                        renderSlide={(project, isFront) => (
                            /* Eager: the whole ring is on screen at once, and a
                               lazy cover shows only its blurred ambient layer
                               until it decodes. */
                            <div className={`coverflow-slide${isFront ? ' is-front' : ''}`}>
                                <ProjectCover project={project} eager />
                            </div>
                        )}
                    />

                    <div className="showcase-feature">
                        {featured && (
                            /* Keyed so a new project re-runs the fade rather than
                               swapping text in place. */
                            <div className="showcase-feature-inner" key={featured.id}>
                                <p className="showcase-feature-name">
                                    {featured.projectName}
                                    {featured.codename && (
                                        <span className="showcase-codename">{featured.codename}</span>
                                    )}
                                </p>
                                <p className="showcase-feature-blurb">{featured.blurb}</p>
                                <p className="showcase-feature-meta">
                                    <span className={`showcase-status ${statusClassMap[featured.status] || ''}`}>
                                        {statusLabels[featured.status]}
                                    </span>
                                    <span className="showcase-feature-year">{formatYear(featured.year)}</span>
                                    {featured.location && (
                                        <span className="showcase-location">
                                            <TbMapPin aria-hidden="true" />
                                            {featured.location}
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    <a className="showcase-readmore" href="#all-projects">
                        All Projects ↓
                    </a>

                    <motion.ul
                        id="all-projects"
                        key={categoryFilter}
                        className="showcase-list"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {sorted.map((project, index) => (
                            <motion.li key={project.id} className="showcase-item" variants={staggerItem}>
                                <button
                                    type="button"
                                    className={`showcase-row${hoveredIndex === index ? ' is-active' : ''}`}
                                    onClick={() => handleProjectClick(project)}
                                    onMouseEnter={() => {
                                        setHoveredIndex(index);
                                        prefetchProject(project);
                                    }}
                                    onFocus={() => prefetchProject(project)}
                                >
                                    {/* Touch users never see the cursor preview, so the
                                        cover rides along in the row instead. A plain
                                        img, not ProjectCover — a button may only hold
                                        phrasing content. */}
                                    <span className="showcase-thumb" aria-hidden="true">
                                        <img
                                            src={`/assets/${project.id}.webp`}
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                            onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
                                        />
                                    </span>

                                    <span className="showcase-body">
                                        <span className="showcase-heading">
                                            <span className="showcase-name">
                                                {project.projectName}
                                                <span className="showcase-underline" aria-hidden="true" />
                                            </span>
                                            {project.codename && (
                                                <span className="showcase-codename">{project.codename}</span>
                                            )}
                                            <TbArrowUpRight className="showcase-arrow" aria-hidden="true" />
                                        </span>

                                        <span className="showcase-blurb">{project.blurb}</span>

                                        <span className="showcase-meta">
                                            <span className={`showcase-status ${statusClassMap[project.status] || ''}`}>
                                                {statusLabels[project.status]}
                                            </span>
                                            {project.location && (
                                                <span className="showcase-location">
                                                    <TbMapPin aria-hidden="true" />
                                                    {project.location}
                                                </span>
                                            )}
                                        </span>
                                    </span>

                                    <span className="showcase-year">{formatYear(project.year)}</span>
                                </button>
                            </motion.li>
                        ))}
                    </motion.ul>
                </>
            )}

            <ProjectModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onCloseComplete={handleModalCloseComplete}
                selectedProject={selectedProject}
                prefetchedMarkdown={selectedProject ? markdownCache[selectedProject.id] : undefined}
            />
        </div>
    );
}

export default ProjectShowcase;
