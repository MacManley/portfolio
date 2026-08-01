import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { TbMapPin } from 'react-icons/tb';
import { statusLabels, statusClassMap } from '../data/projectsData';
import ProjectCover from './ProjectCover';
import TimelineLogo from './TimelineLogo';
import './ProjectTimeline.css';

function TimelineCard({ project, formatYear, renderTech, onSelect, onPrefetch }) {
    return (
        <div
            className="pt-card"
            onClick={() => onSelect(project)}
            onMouseEnter={() => onPrefetch(project)}
        >
            <ProjectCover project={project}>
                <div className={`status-container ${statusClassMap[project.status] || ''}`}>
                    <span>{statusLabels[project.status]}</span>
                </div>
            </ProjectCover>

            <div className="pt-card-body">
                <p className="pt-card-meta">
                    <span className="pt-card-year">{formatYear(project.year)}</span>
                    {project.codename && (
                        <>
                            <span className="meta-sep" aria-hidden="true">/</span>
                            <span className="codename-label">Project</span>
                            <span className="codename-slot">{project.codename}</span>
                        </>
                    )}
                </p>

                <h3 className="project-name">{project.projectName}</h3>

                {project.location && (
                    <p className="pt-location">
                        <TbMapPin aria-hidden="true" />
                        <span>{project.location}</span>
                    </p>
                )}

                <p className="pt-blurb">{project.blurb}</p>

                {project.type && project.type.length > 0 && (
                    <div className="project-tags">
                        {project.type.map((type) => (
                            <span key={type} className="project-tag">{type}</span>
                        ))}
                    </div>
                )}

                {renderTech(project)}
            </div>
        </div>
    );
}

export default function ProjectTimeline({ projects, renderTech, formatYear, groupYear, onSelect, onPrefetch }) {
    const timelineRef = useRef(null);
    const reduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ['start center', 'end end'],
    });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    let lastYear = null;

    return (
        <div className="pt-timeline" ref={timelineRef}>
            {/* The rail spans the rows only — the end cap draws its own short
                connector, so the line never runs behind the label text. */}
            <div className="pt-entries">
                <div className="pt-track">
                    <div className="pt-track-fill" />
                    <motion.div className="pt-track-progress" style={{ height: lineHeight }} />
                </div>

                {projects.map((project, index) => {
                    const side = index % 2 === 0 ? 'is-left' : 'is-right';
                    const offset = reduceMotion ? 0 : (side === 'is-left' ? -32 : 32);
                    // Group by the project's start year, so a 2023–2026 project files
                    // under 2023 rather than opening a section of its own.
                    const year = groupYear(project);
                    const marker = year !== lastYear ? year : null;
                    lastYear = year;

                    return (
                        <div key={project.id} className="pt-entry">
                            {marker && (
                                <div className="pt-year-marker">
                                    <span>{marker}</span>
                                </div>
                            )}

                            <motion.div
                                className={`pt-row ${side}`}
                                initial={{ opacity: 0, x: offset }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.35 }}
                                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <TimelineLogo src={project.logo} alt={project.projectName} />

                                <TimelineCard
                                    project={project}
                                    formatYear={formatYear}
                                    renderTech={renderTech}
                                    onSelect={onSelect}
                                    onPrefetch={onPrefetch}
                                />
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            <div className="pt-end">
                <div className="pt-end-node" aria-hidden="true">+</div>
                <p className="pt-end-label">More projects soon</p>
            </div>
        </div>
    );
}
