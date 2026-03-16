import { useState } from 'react';
import '../components/ProjectModal.css';
import './Contact.css';
import { techIconMap } from '../data/projectsData';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const contactLinks = [
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/nathan-manley',
    icon: techIconMap.LinkedIn
  },
  {
    label: 'GitHub',
    url: 'https://github.com/MacManley',
    icon: techIconMap.GitHub
  }
];

export default function Contact() {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const openContactModal = () => {
    setModalOpen(true);
    setEmailTouched(false);
    setEmail('');
  };

  function onDocLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function nextPage() {
    setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev));
  }

  function prevPage() {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }

  return (
    <div className="contact-page">
      <div className="contact-header page-header">
        <p className="page-eyebrow">Let's collaborate</p>
        <h1 className="page-title">Contact</h1>
        <p className="page-description">
          Whether it's a project, partnership, or just a quick question, I'm
          always open to a new challenge. Share what you're building
          and I will respond.
        </p>
      </div>

      <div className="contact-grid">
        <section className="contact-card contact-details">
          <div>
            <h3>Reach Out Directly</h3>
            <p>
              From hackathons to embedded systems, I've helped ship reliable
              projects across hardware, software, and AI. Click the links to see the work on
              display or send a DM.
            </p>
          </div>

          <div className="contact-links">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                className="contact-link"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="link-icon">{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>

        </section>

        <section className="contact-card cv-card">
          <div className="cv-header">
            <h3>CV & Track Record</h3>
            
            <p>Grab my latest CV, jump into PDF view or download it.</p>
          </div>

          <div className="cv-actions">
            <button className="button-main" onClick={() => setShowModal(true)}>
              View CV
            </button>
            <a className="button-main button-secondary" href="/assets/cv.pdf" download>
              Download CV (PDF)
            </a>
          </div>

          <div className="cv-stats">
            <div className="stat-block">
              <span className="stat-value">10+</span>
              <span className="stat-label">Active years</span>
            </div>
            <div className="stat-block">
              <span className="stat-value">20+</span>
              <span className="stat-label">Projects</span>
            </div>
          </div>
        </section>

        <section className="contact-card highlight-card">
          <h3>Expect a response</h3>
          <p>
            I will respond to any queries within 48 hours.
            I'll see how I can help, what I want to hear is:
          </p>
          <ul className="highlight-list">
            <li>Clear timelines</li>
            <li>Built prototypes, not just code</li>
            <li>Realistic expectations</li>
          </ul>
          <button className="button-main button-alt" onClick={openContactModal}>
            Start the conversation
          </button>
        </section>
      </div>

      {showModal && (
        <div className="modal-overlay cv-overlay">
          <div className="modal-content cv-modal">
            <div className="cv-modal-top">
              <div>
                <p className="cv-eyebrow">Curriculum Vitae</p>
                <h2 className="cv-title">CV Preview</h2>
                <p className="cv-subtitle">Flip through the PDF or download the full copy.</p>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="cv-toolbar">
              <button
                className="button-main"
                onClick={prevPage}
                disabled={pageNumber <= 1}
              >
                ◀ Previous Page
              </button>
              <button
                className="button-main"
                onClick={nextPage}
                disabled={numPages && pageNumber >= numPages}
              >
                Next Page ▶
              </button>
              <a href="/assets/cv.pdf" download className="button-main pdf-download-btn">
                ⬇ Download CV
              </a>
              <span className="cv-page-indicator">
                Page {pageNumber} of {numPages}
              </span>
            </div>
            <div className="cv-viewer">
              <Document file="/assets/cv.pdf" onLoadSuccess={onDocLoadSuccess}>
                <div className="pdf-page-wrapper">
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={window.innerWidth < 480 ? 300 : 600}
                  />
                </div>
              </Document>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>
              &times;
            </button>
            <form
              className="contact-form"
              action="https://formspree.io/f/mrblrppa"
              method="POST"
            >
              <input type="text" name="website" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
              <h3>Contact Me</h3>
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className={emailTouched && !isEmailValid ? 'input-error' : ''}
              />
              {emailTouched && !isEmailValid && (
                <span className="input-error-message">Please enter a valid email address.</span>
              )}
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required rows={5} />
              <button className="button-main" type="submit" disabled={!isEmailValid}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
