import { useEffect, useRef, useState } from 'react';
import { projects, statusLabels, statusColorMap, techIconMap } from '../data/projectsData';
import ProjectModal from './ProjectModal';
import './ViewProjects.css';

function ProjectLinkStack({ projectId, links }) {
    const containerRef = useRef(null);
    const measureLinkRefs = useRef([]);
    const measureMoreRefs = useRef({});
    const [visibleCount, setVisibleCount] = useState(links.length);
    const LINK_GAP = 8;

    useEffect(() => {
        let frameId;

        const computeVisibleCount = () => {
            const container = containerRef.current;
            if (!container || links.length === 0) {
                setVisibleCount(0);
                return;
            }

            const availableWidth = container.clientWidth;
            const linkWidths = links.map((_, index) => measureLinkRefs.current[index]?.offsetWidth || 0);
            const moreWidths = {};
            for (let hidden = 1; hidden <= links.length; hidden += 1) {
                moreWidths[hidden] = measureMoreRefs.current[hidden]?.offsetWidth || 0;
            }

            const missingMeasurements =
                linkWidths.some((width) => width === 0) || Object.values(moreWidths).some((width) => width === 0);

            if (missingMeasurements) {
                frameId = window.requestAnimationFrame(computeVisibleCount);
                return;
            }

            let nextVisibleCount = links.length;

            for (let count = links.length; count >= 0; count -= 1) {
                const hiddenCount = links.length - count;
                let usedWidth = 0;

                if (count > 0) {
                    usedWidth += linkWidths.slice(0, count).reduce((sum, width) => sum + width, 0);
                    usedWidth += LINK_GAP * (count - 1);
                }

                if (hiddenCount > 0) {
                    if (count > 0) {
                        usedWidth += LINK_GAP;
                    }
                    usedWidth += moreWidths[hiddenCount];
                }

                if (usedWidth <= availableWidth) {
                    nextVisibleCount = count;
                    break;
                }
            }

            setVisibleCount((prev) => (prev === nextVisibleCount ? prev : nextVisibleCount));
        };

        computeVisibleCount();

        let observer;
        if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
            observer = new ResizeObserver(computeVisibleCount);
            observer.observe(containerRef.current);
        }

        window.addEventListener('resize', computeVisibleCount);
        return () => {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
            }
            if (observer) {
                observer.disconnect();
            }
            window.removeEventListener('resize', computeVisibleCount);
        };
    }, [links]);

    const hiddenCount = Math.max(links.length - visibleCount, 0);

    return (
        <div className="project-link-stack-wrap">
            <div className="project-link-stack" ref={containerRef}>
                {links.slice(0, visibleCount).map((link, index) => (
                    <a
                        key={`${projectId}-${link.label}-${index}`}
                        className="project-link-chip"
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <span>{link.label}</span>
                        {techIconMap[link.site] && <span className="link-icon">{techIconMap[link.site]}</span>}
                    </a>
                ))}
                {hiddenCount > 0 && <span className="project-link-chip more">+{hiddenCount} more</span>}
            </div>

            <div className="project-link-measure" aria-hidden="true">
                {links.map((link, index) => (
                    <span
                        key={`measure-link-${projectId}-${index}`}
                        className="project-link-chip"
                        ref={(node) => {
                            measureLinkRefs.current[index] = node;
                        }}
                    >
                        <span>{link.label}</span>
                        {techIconMap[link.site] && <span className="link-icon">{techIconMap[link.site]}</span>}
                    </span>
                ))}

                {links.map((_, index) => {
                    const count = index + 1;
                    return (
                        <span
                            key={`measure-more-${projectId}-${count}`}
                            className="project-link-chip more"
                            ref={(node) => {
                                measureMoreRefs.current[count] = node;
                            }}
                        >
                            +{count} more
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

function ProjectsView({ technologyFilter, statusFilter, searchQuery = '', typeFilter = null }) {
        const [selectedProject, setSelectedProject] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
    const [markdownCache, setMarkdownCache] = useState({});
    const loadingPromises = useRef({});

        const formatYearLabel = (year) => {
            if (Array.isArray(year)) {
                if (year.length === 0) {
                    return '';
                }

                if (year.length === 1) {
                    return year[0];
                }

                if (year.length === 2) {
                    const [first, last] = year;
                    return first === last ? first : `${first}-${last}`;
                }

                const [first, second, ...rest] = year;
                const firstRange = first === second ? first : `${first}-${second}`;
                return [firstRange, ...rest].join(', ');
            }
            return year;
        };

          const filteredProjects = projects.filter((project) => {
                const matchesTech =
                    !technologyFilter || project.technologyUsed.includes(technologyFilter);
                const matchesStatus =
                    statusFilter == null || statusLabels[project.status] === statusFilter;
                const matchesType =
                    !typeFilter || (project.type && project.type.includes(typeFilter));
                const q = searchQuery.trim().toLowerCase();
                const matchesSearch =
                    !q ||
                    project.projectName.toLowerCase().includes(q) ||
                    project.blurb.toLowerCase().includes(q) ||
                    project.role.toLowerCase().includes(q);
                return matchesTech && matchesStatus && matchesType && matchesSearch;
        });

        const noProjects = filteredProjects.length === 0;
        const prefetchImages = (content) => {
            const regex = /!\[[^\]]*\]\(([^\)]+)\)/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                const img = new Image();
                img.src = match[1];
            }
        };

        const prefetchProject = (project) => {
            const cover = new Image();
            cover.src = `/assets/${project.id}.png`;

            if (markdownCache[project.id] || loadingPromises.current[project.id]) {
                return;
            }

            const promise = fetch(`./data/${project.id}.md`)
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
    
    return (
        <div className="project-section">
            {noProjects ? (
                <div className="no-projects">
                    <p>Nothing matches those filters yet. Try clearing one or choose another category.</p>
                </div>
            ) : (
                <div className="project-row">
                    {filteredProjects.map((project) => (
                        <div 
                            key={project.id} 
                            className="project-card"
                            onClick={() => handleProjectClick(project)}
                            onMouseEnter={() => prefetchProject(project)}>
                            <div className="project-image">
                                <img src={`/assets/${project.id}.png`} alt={project.projectName}/>
                                <div className="project-overlay">
                                    <span className="view-details">View</span>
                                </div>
                            </div>
                            
                            <div className="project-content">
                                <div className="project-header">
                                    <h3>{project.projectName}</h3>
                                    <div className="status-container" style={{backgroundColor: statusColorMap[project.status] || "black" }}>
                                        <span>{statusLabels[project.status]}</span>
                                    </div>
                                </div>
                                
                                <div className="project-meta">
                                    <span className="project-year-badge">{formatYearLabel(project.year)}</span>
                                </div>
                                {project.links.length > 0 && (
                                    <ProjectLinkStack projectId={project.id} links={project.links} />
                                )}

                                <p className="project-blurb">{project.blurb}</p>
                                
                                { project.role.trim() !== '' && (
                                    <div className="project-role">
                                        <span className="role-label">Role:</span>
                                        <span className="role-text">{project.role}</span>
                                    </div>
                                )}                            
                                <div className="tech-stack">
                                    <span className="tech-label">Technologies:</span>
                                    <div className="tech-icons">
                                        {[...project.technologyUsed].sort().map((tech, index) => (
                                            <span key={index} className="tech-icon" alt={tech} title={tech}>
                                                {techIconMap[tech] || tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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