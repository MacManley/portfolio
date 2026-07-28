import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { statusLabels, statusClassMap, techIconMap } from '../data/projectsData';
import { staggerContainer, staggerItem } from '../motion/variants';
import ProjectModal from './ProjectModal';
import './ViewProjects.css';

// Narrow cards only have room for one row of icons — the rest collapse into a +N chip.
const MAX_VISIBLE_TECH = 5;

const pad = (value) => String(value).padStart(2, '0');

const formatYear = (year) => {
    if (!Array.isArray(year)) return year;
    if (year.length === 0) return '';
    const first = Math.min(...year);
    const last = Math.max(...year);
    return first === last ? `${first}` : `${first}–${last}`;
};

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

function ProjectsView({ projects = [], categoryFilter = 'All' }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [markdownCache, setMarkdownCache] = useState({});
    const loadingPromises = useRef({});
    // Callback ref, not useRef: changing the filter remounts the grid, and the
    // observer has to follow the new node rather than the detached one.
    const [rowNode, setRowNode] = useState(null);
    const [columns, setColumns] = useState(1);

    const noProjects = projects.length === 0;
    const [heroProject, ...restProjects] = projects;

    // The grid uses auto-fill, so the column count only exists in CSS — read it
    // back to know how many slots the last row leaves empty.
    useEffect(() => {
        if (!rowNode || typeof ResizeObserver === 'undefined') {
            return undefined;
        }

        const measure = () => {
            const template = getComputedStyle(rowNode).gridTemplateColumns;
            const count = template.split(' ').filter(Boolean).length;
            if (count > 0) {
                setColumns(count);
            }
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(rowNode);
        return () => observer.disconnect();
    }, [rowNode]);

    const emptySlots = columns > 1 ? (columns - (restProjects.length % columns)) % columns : 0;

    const prefetchImages = (content) => {
        const regex = /!\[[^\]]*\]\(([^)]+)\)/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            const img = new Image();
            img.src = match[1];
        }
    };

    const prefetchProject = (project) => {
        const cover = new Image();
        cover.src = `/assets/${project.id}.webp`;

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
                setMarkdownCache(prev => {
                    const next = { ...prev, [project.id]: content };
                    return next;
                });
                prefetchImages(content);
            })
            .catch(err => console.warn('Prefetch failed', err))
            .finally(() => {
                delete loadingPromises.current[project.id];
            });

        loadingPromises.current[project.id] = promise;
    };

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

    const renderStatus = (project) => (
        <div className={`status-container ${statusClassMap[project.status] || ''}`}>
            <span>{statusLabels[project.status]}</span>
        </div>
    );

    const renderLinks = (project, limit) => {
        if (project.links.length === 0) return null;
        const shown = project.links.slice(0, limit);
        const overflow = project.links.length - shown.length;

        return (
            <div className="project-reveal-links">
                {shown.map((link, linkIndex) => (
                    <a
                        key={`${project.id}-${linkIndex}`}
                        className="project-link-chip"
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <span className="link-label">{link.label}</span>
                        {techIconMap[link.site] && <span className="link-icon">{techIconMap[link.site]}</span>}
                    </a>
                ))}
                {overflow > 0 && <span className="project-link-chip more">+{overflow}</span>}
            </div>
        );
    };

    return (
        <div className="project-section">
            {noProjects ? (
                <div className="no-projects">
                    <p>Nothing matches that filter yet. Try another category.</p>
                </div>
            ) : (
                <motion.div key={categoryFilter} ref={setRowNode} className="project-row" variants={staggerContainer} initial="hidden" animate="show">
                    <motion.div
                        key={heroProject.id}
                        variants={staggerItem}
                        whileTap={{ scale: 0.995 }}
                        className="project-card project-card--hero"
                        onClick={() => handleProjectClick(heroProject)}
                        onMouseEnter={() => prefetchProject(heroProject)}>
                        <div className="project-image">
                            <img
                                src={`/assets/${heroProject.id}.webp`}
                                alt={heroProject.projectName}
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                            />
                            {renderStatus(heroProject)}
                        </div>

                        <div className="project-content">
                            <div className="project-meta">
                                <span className="project-index">{pad(1)}</span>
                                <span className="meta-sep" aria-hidden="true">/</span>
                                <span className="project-year">{formatYear(heroProject.year)}</span>
                            </div>

                            <h3 className="project-name">{heroProject.projectName}</h3>
                            <p className="project-blurb">{heroProject.blurb}</p>

                            {heroProject.role.trim() !== '' && (
                                <p className="project-role">
                                    <span className="role-label">Role</span>
                                    <span className="role-text">{heroProject.role}</span>
                                </p>
                            )}

                            {renderLinks(heroProject, 3)}

                            <div className="project-content-footer">
                                <TechIcons project={heroProject} />
                                {heroProject.codename && (
                                    <span className="project-codename">
                                        <span className="codename-label">Project</span>
                                        <span className="codename-slot">{heroProject.codename}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {restProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            variants={staggerItem}
                            whileTap={{ scale: 0.98 }}
                            className="project-card"
                            onClick={() => handleProjectClick(project)}
                            onMouseEnter={() => prefetchProject(project)}>
                            <div className="project-image">
                                <img
                                    src={`/assets/${project.id}.webp`}
                                    alt={project.projectName}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="project-reveal">
                                    <p className="project-reveal-blurb">{project.blurb}</p>
                                </div>
                                {renderStatus(project)}
                            </div>

                            <div className="project-content">
                                <div className="project-meta">
                                    <span className="project-index">{pad(index + 2)}</span>
                                    <span className="meta-sep" aria-hidden="true">/</span>
                                    <span className="project-year">{formatYear(project.year)}</span>
                                </div>

                                <h3 className="project-name">{project.projectName}</h3>

                                {project.type && project.type.length > 0 && (
                                    <div className="project-tags">
                                        {project.type.map((type) => (
                                            <span key={type} className="project-tag">{type}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="project-content-footer">
                                    <TechIcons project={project} limit={MAX_VISIBLE_TECH} />
                                    {project.codename && (
                                        <span className="project-codename">
                                            <span className="codename-label">Project</span>
                                            <span className="codename-slot">{project.codename}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {Array.from({ length: emptySlots }, (_, slotIndex) => (
                        <div
                            key={`slot-${slotIndex}`}
                            className={`project-card project-slot${slotIndex === 0 ? ' project-slot--message' : ''}`}
                            aria-hidden={slotIndex === 0 ? undefined : 'true'}
                        >
                            {slotIndex === 0 && (
                                <>
                                    <span className="slot-plus" aria-hidden="true">+</span>
                                    <span className="slot-label">More projects soon</span>
                                </>
                            )}
                        </div>
                    ))}
                </motion.div>
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

export default ProjectsView;
