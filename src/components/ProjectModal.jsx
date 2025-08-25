import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './ProjectModal.css';
import { techIconMap } from '../data/projectsData';


function ProjectModal({ isOpen, onClose, selectedProject }) {
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    if (isOpen && selectedProject) {
      // Load the markdown file based on project ID
      fetch(`./data/${selectedProject.id}.md`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Markdown file not found');
          }
          return response.text();
        })
        .then(content => setMarkdownContent(content))
        .catch(error => {
          console.error('Error loading markdown:', error);
          setMarkdownContent('# Project Details\n\nAn error occurred loading the markdown file, it is probably my dodgy code! Please refresh the page!');
        });
    }
  }, [isOpen, selectedProject]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <h1>{selectedProject.projectName}</h1>
            {selectedProject && (
              <div className="modal-project-info">
                <p className="modal-blurb">{selectedProject.blurb}</p>
                {selectedProject.role.trim() !== '' && (
                <div className="modal-role">
                  <span className="role-label">Role: </span>
                  <span className="role-text">{selectedProject.role}</span>
                  </div>
                )}
                </div>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="markdown-content">
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
          {selectedProject.links.length > 0 && (
          <div className="project-links">
             <h3>Links</h3>
             {selectedProject.links.map((link, idx) => (
              <div key={idx}>
               <a href={link.url} target="_blank" rel="noreferrer">
               <span>{link.label}</span>
               <span> {techIconMap[link.site]}</span>
             </a>
             </div>
             ))}
            </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default ProjectModal; 