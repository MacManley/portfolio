import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TbMapPin, TbPlus } from 'react-icons/tb';
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
    const entriesRef = useRef(null);
    const progressRef = useRef(null);
    const endRef = useRef(null);
    const reduceMotion = useReducedMotion();

    // Driven by hand rather than useScroll: viewport-relative offsets can't
    // complete here, because the end cap and footer sit below the rows and keep
    // their bottom edge away from the bottom of the screen. Instead the fill is
    // measured against the last node, so it always finishes once that node has
    // passed 70% of the viewport — whatever is or isn't below it.
    useEffect(() => {
        const entries = entriesRef.current;
        const progress = progressRef.current;
        const end = endRef.current;
        if (!entries || !progress) return undefined;

        const update = () => {
            const nodes = entries.querySelectorAll('.pt-row .timeline-logo');
            const last = nodes[nodes.length - 1];
            if (!last) return;

            const entriesRect = entries.getBoundingClientRect();
            const lastRect = last.getBoundingClientRect();
            // Distance from the top of the rail to the last node's centre. Fixed,
            // so scrolling doesn't change it.
            const target = lastRect.top + lastRect.height / 2 - entriesRect.top;
            if (target <= 0) return;

            // The line the last node must rise past for the rail to read as full.
            // On a tall screen the node stops ~460px short of the bottom, so 70%
            // of the viewport can be a line it never crosses — hence the floor of
            // "300px from the bottom", which it always reaches.
            const trigger = Math.max(window.innerHeight * 0.7, window.innerHeight - 300);
            const reached = trigger - entriesRect.top;
            const ratio = Math.min(1, Math.max(0, reached / target));
            progress.style.height = `${ratio * 100}%`;

            // Once the rows are lit, carry the line through the end cap so the
            // rail finishes at the "+" instead of dying into grey above it.
            if (end) {
                end.classList.toggle('is-lit', ratio >= 1);
            }
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, [projects]);

    let lastYear = null;

    return (
        <div className="pt-timeline" id="timeline">
            {/* The rail spans the rows only — the end cap draws its own short
                connector, so the line never runs behind the label text. */}
            <div className="pt-entries" ref={entriesRef}>
                <div className="pt-track">
                    <div className="pt-track-fill" />
                    <div className="pt-track-progress" ref={progressRef} />
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

            <div className="pt-end" ref={endRef}>
                {/* An icon, not a "+" glyph: the character sits off its own optical
                    centre inside a circle, the SVG doesn't. */}
                <div className="pt-end-node" aria-hidden="true">
                    <TbPlus />
                </div>
                <p className="pt-end-label">More projects soon</p>
            </div>
        </div>
    );
}
