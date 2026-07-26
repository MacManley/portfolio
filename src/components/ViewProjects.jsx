import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { projects, statusLabels, statusClassMap, techIconMap } from '../data/projectsData';
import { staggerContainer, staggerItem } from '../motion/variants';
import ProjectModal from './ProjectModal';
import './ViewProjects.css';

function ProjectsView({ categoryFilter = 'All' }) {
        const [selectedProject, setSelectedProject] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
    const [markdownCache, setMarkdownCache] = useState({});
    const loadingPromises = useRef({});

          const filteredProjects = projects.filter((project) => {
                if (categoryFilter === 'All') return true;
                if (categoryFilter === 'Hardware') return project.type && project.type.includes('Hardware');
                if (categoryFilter === 'Software') return !project.type || !project.type.includes('Hardware') || project.type.includes('Software');
                return true;
        });

        const noProjects = filteredProjects.length === 0;
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

    return (
        <div className="project-section">
            {noProjects ? (
                <div className="no-projects">
                    <p>Nothing matches that filter yet. Try another category.</p>
                </div>
            ) : (
                <motion.div key={categoryFilter} className="project-row" variants={staggerContainer} initial="hidden" animate="show">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={staggerItem}
                            whileTap={{ scale: 0.98 }}
                            className={`project-card${project.featured ? ' project-card--feature' : ''}`}
                            onClick={() => handleProjectClick(project)}
                            onMouseEnter={() => prefetchProject(project)}>
                            <div className="project-image">
                                <img src={`/assets/${project.id}.webp`} alt={project.projectName}/>
                                <div className="project-reveal">
                                    <p className="project-reveal-blurb">{project.blurb}</p>
                                    {project.links.length > 0 && (
                                        <div className="project-reveal-links">
                                            {project.links.slice(0, 3).map((link, linkIndex) => (
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
                                            {project.links.length > 3 && (
                                                <span className="project-link-chip more">+{project.links.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className={`status-container ${statusClassMap[project.status] || ''}`}>
                                    <span>{statusLabels[project.status]}</span>
                                </div>
                            </div>

                            <div className="project-content">
                                <div className="project-header">
                                    <h3 className="project-name">{project.projectName}</h3>
                                    {project.featured && <p className="project-blurb">{project.blurb}</p>}
                                </div>

                                <div className="project-content-footer">
                                    <div className="tech-icons">
                                        {[...project.technologyUsed].sort().map((tech, techIndex) => (
                                            <span key={techIndex} className="tech-icon" alt={tech} title={tech}>
                                                {techIconMap[tech] || tech}
                                            </span>
                                        ))}
                                    </div>

                                    <span className="project-codename">
                                        <span className="codename-label">Project</span>
                                        <span className={`codename-slot${project.codename ? '' : ' is-empty'}`}>
                                            {project.codename}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
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
