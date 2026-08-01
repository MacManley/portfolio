import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TbMapPin } from 'react-icons/tb';
import { statusLabels, statusClassMap, techIconMap } from '../data/projectsData';
import { fadeUp } from '../motion/variants';
import ProjectCover from './ProjectCover';
import ProjectModal from './ProjectModal';
import ProjectTimeline from './ProjectTimeline';
import './ViewProjects.css';

// Cards only have room for one row of icons — the rest collapse into a +N chip.
const MAX_VISIBLE_TECH = 5;

const formatYear = (year) => {
    if (!Array.isArray(year)) return `${year}`;
    if (year.length === 0) return '';
    const first = Math.min(...year);
    const last = Math.max(...year);
    return first === last ? `${first}` : `${first}–${last}`;
};

// A multi-year project belongs to the year it started, so that's both its rail
// marker and its sort key — otherwise the markers wouldn't stay in order.
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

function ProjectsView({ projects = [], categoryFilter = 'All' }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [markdownCache, setMarkdownCache] = useState({});
    const loadingPromises = useRef({});

    // Array.prototype.sort is stable, so the curated data order breaks year ties.
    const sorted = useMemo(() => [...projects].sort((a, b) => startYear(b) - startYear(a)), [projects]);
    const heroProject = useMemo(() => sorted.find((project) => project.featured) || sorted[0], [sorted]);
    const timelineProjects = useMemo(
        () => sorted.filter((project) => project !== heroProject),
        [sorted, heroProject]
    );

    const noProjects = sorted.length === 0;

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

    const renderLinks = (project, limit) => {
        if (project.links.length === 0) return null;
        const shown = project.links.slice(0, limit);
        const overflow = project.links.length - shown.length;

        return (
            <div className="project-links-row">
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
                <div key={categoryFilter} className="project-stack">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        whileTap={{ scale: 0.995 }}
                        className="project-card project-card--hero"
                        onClick={() => handleProjectClick(heroProject)}
                        onMouseEnter={() => prefetchProject(heroProject)}>
                        <ProjectCover project={heroProject} eager>
                            <div className={`status-container ${statusClassMap[heroProject.status] || ''}`}>
                                <span>{statusLabels[heroProject.status]}</span>
                            </div>
                        </ProjectCover>

                        <div className="project-content">
                            <div className="project-meta">
                                <span className="project-index">Featured</span>
                                <span className="meta-sep" aria-hidden="true">/</span>
                                <span className="project-year">{formatYear(heroProject.year)}</span>
                                {heroProject.location && (
                                    <>
                                        <span className="meta-sep" aria-hidden="true">/</span>
                                        <span className="project-location">
                                            <TbMapPin aria-hidden="true" />
                                            {heroProject.location}
                                        </span>
                                    </>
                                )}
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

                    {timelineProjects.length > 0 && (
                        <ProjectTimeline
                            projects={timelineProjects}
                            formatYear={formatYear}
                            groupYear={startYear}
                            renderTech={(project) => <TechIcons project={project} limit={MAX_VISIBLE_TECH} />}
                            onSelect={handleProjectClick}
                            onPrefetch={prefetchProject}
                        />
                    )}
                </div>
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
