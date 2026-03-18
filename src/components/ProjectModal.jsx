import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './ProjectModal.css';
import { techIconMap } from '../data/projectsData';


const CLOSE_ANIMATION_MS = 300;

function ProjectModal({ isOpen, onClose, onCloseComplete, selectedProject, prefetchedMarkdown }) {
  const [markdownContent, setMarkdownContent] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      return undefined;
    }

    if (isVisible) {
      setIsClosing(true);
      const timeoutId = window.setTimeout(() => {
        setIsClosing(false);
        setIsVisible(false);
        setMarkdownContent('');
        if (typeof onCloseComplete === 'function') {
          onCloseComplete();
        }
      }, CLOSE_ANIMATION_MS);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [isOpen, isVisible, onCloseComplete]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    document.body.style.overflow = isVisible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!selectedProject) {
      return;
    }

    if (prefetchedMarkdown) {
      setMarkdownContent(prefetchedMarkdown);
      return;
    }

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
  }, [isOpen, selectedProject, prefetchedMarkdown]);

  if (!isVisible) return null;

  return (
    <div className={`modal-overlay${isClosing ? ' closing' : ''}`} onClick={onClose}>
      <div className={`modal-content${isClosing ? ' closing' : ''}`} onClick={e => e.stopPropagation()}>
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
                <div>
                  <span className="year-label">Year: </span>
                  <span className="year-text">{Array.isArray(selectedProject.year) ? selectedProject.year.join(", ") : selectedProject.year}</span>
                </div>
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