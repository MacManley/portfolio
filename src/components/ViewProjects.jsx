import { useState } from 'react';
import { projects, statusLabels, statusColorMap, techIconMap } from '../data/projectsData';
import ProjectModal from './ProjectModal';
import './ViewProjects.css';

function ProjectsView({ technologyFilter, statusFilter }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredProjects = projects.filter((project) => {
        const matchesTech =
          !technologyFilter || project.technologyUsed.includes(technologyFilter);
        const matchesStatus =
          statusFilter == null || statusLabels[project.status] === statusFilter;
        return matchesTech && matchesStatus;
    });

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };
    
    return (
        <div className="project-section">
            <div className="project-row">
                {filteredProjects.map((project) => (
                    <div 
                        key={project.id} 
                        className="project-card"
                        onClick={() => handleProjectClick(project)}
                        style={{ cursor: 'pointer' }}
                    >
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
                                    {project.technologyUsed.sort().map((tech, index) => (
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
            
            <ProjectModal
                isOpen={isModalOpen}
                onClose={closeModal}
                selectedProject={selectedProject}
            />
        </div>
    );
}

export default ProjectsView;