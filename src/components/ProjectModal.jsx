import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import './ProjectModal.css';
import { techIconMap } from '../data/projectsData';
import { modalOverlayVariants, modalContentVariants } from '../motion/variants';

function ProjectModal({ isOpen, onClose, onCloseComplete, selectedProject, prefetchedMarkdown }) {
  const [markdownContent, setMarkdownContent] = useState('');
  const contentRef = useRef(null);
  const closeButtonRef = useRef(null);
  const openerRef = useRef(null);

  // Scroll lock, Escape to close, and a focus trap that hands focus back to
  // whatever opened the dialog.
  useEffect(() => {
    if (typeof document === 'undefined' || !isOpen) {
      return undefined;
    }

    openerRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !contentRef.current) {
        return;
      }

      const focusable = contentRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = '';
      if (openerRef.current instanceof HTMLElement) {
        openerRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

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

    fetch(`/data/${selectedProject.id}.md`)
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

  return (
    <AnimatePresence onExitComplete={onCloseComplete}>
      {isOpen && selectedProject && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="modal-content"
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={e => e.stopPropagation()}
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="modal-header">
              <div className="modal-header-content">
                <p className="modal-codename" id="project-modal-title">{selectedProject.projectName}</p>
                <div className="modal-project-info">
                  <p className="modal-blurb">{selectedProject.blurb}</p>
                  <div className="modal-designation">
                    <span className="codename-label">Project </span>
                    <span className={`codename-slot${selectedProject.codename ? '' : ' is-empty'}`}>
                      {selectedProject.codename}
                    </span>
                  </div>
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
              </div>
              <button
                className="modal-close"
                ref={closeButtonRef}
                type="button"
                aria-label="Close project details"
                onClick={onClose}
              >
                ×
              </button>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProjectModal;
