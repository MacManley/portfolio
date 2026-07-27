import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TbAlertTriangle, TbBrandLinkedin, TbBrandGithub, TbDownload, TbX } from 'react-icons/tb';
import '../components/ProjectModal.css';
import './Contact.css';
import { modalOverlayVariants, modalContentVariants, pageTransition } from '../motion/variants';
import RevealSection from '../motion/RevealSection';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const contactLinks = [
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/nathan-manley',
    icon: <TbBrandLinkedin />
  },
  {
    label: 'GitHub',
    url: 'https://github.com/MacManley',
    icon: <TbBrandGithub />
  }
];

export default function Contact() {
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const [numPages, setNumPages] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pageWidth, setPageWidth] = useState(620);
  const viewerRef = useRef(null);

  function onDocLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Size pages to the viewer instead of a hardcoded width, and keep it in sync on resize.
  useEffect(() => {
    if (!showModal) return undefined;

    const el = viewerRef.current;
    if (!el) return undefined;

    const measure = () => {
      const available = el.clientWidth - 36;
      setPageWidth(Math.max(260, Math.min(available, 820)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [showModal]);

  // Esc to close + lock background scroll while open.
  useEffect(() => {
    if (!showModal) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setShowModal(false);
    };

    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [showModal]);

  return (
    <motion.div className="contact-page" variants={pageTransition} initial="hidden" animate="show" exit="exit">
      <section className="contact-hero">
        <p className="page-eyebrow">WHERE TO FIND ME</p>
        <h1 className="page-title contact-headline">Contact</h1>
        <p className="contact-hero-sub">
          Whether it's a project, partnership, or just a quick question, I'm
          always open to a new challenge. Share what you're building and I will respond.
        </p>
        <a className="hero-readmore" href="#get-in-touch">Get In Touch ↓</a>

        <div className="contact-hero-bottom">
          <div className="hero-socials">
            {contactLinks.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noreferrer" aria-label={link.label}>
                {link.icon}
              </a>
            ))}
          </div>
          <p className="hero-location">I usually reply within 48 hours</p>
        </div>
      </section>

      <section id="get-in-touch" className="contact-more">
        <div className="contact-more-column contact-info-column">
          <RevealSection className="contact-card">
            <h3>Reach Out Directly</h3>
            <p>
              From hackathons to embedded systems, I've helped ship reliable
              projects across hardware, software, and AI. Click the links to see the work on
              display or send a DM.
            </p>
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
          </RevealSection>

          <RevealSection className="contact-card cv-card" delay={0.08}>
            <h3>CV & Track Record</h3>
            <p>View or download my CV.</p>
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
          </RevealSection>
        </div>

        <RevealSection className="contact-form-panel" delay={0.16}>
          <h3>Send a Message</h3>
          <p className="contact-form-note">
            What helps most: clear timelines, working prototypes over just code, and realistic expectations.
          </p>
          <form
            className="contact-form"
            action="https://formspree.io/f/mrblrppa"
            method="POST"
          >
            <input type="text" name="website" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
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
              <span className="input-error-message"><TbAlertTriangle /> Please enter a valid email address.</span>
            )}
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required rows={6} />
            <button className="button-main" type="submit" disabled={!isEmailValid}>
              Send
            </button>
          </form>
        </RevealSection>
      </section>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay cv-overlay"
            onClick={() => setShowModal(false)}
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="modal-content cv-modal"
              onClick={(e) => e.stopPropagation()}
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="cv-modal-top">
                <div className="cv-modal-heading">
                  <p className="cv-eyebrow">Curriculum Vitae</p>
                  <h2 className="cv-title">Nathan Manley</h2>
                  {numPages && <span className="cv-page-indicator">{numPages} pages</span>}
                </div>
                <div className="cv-modal-actions">
                  <a href="/assets/cv.pdf" download className="button-main cv-download-btn">
                    <TbDownload /> Download
                  </a>
                  <button className="cv-close-btn" onClick={() => setShowModal(false)} aria-label="Close CV preview">
                    <TbX />
                  </button>
                </div>
              </div>

              <div className="cv-viewer" ref={viewerRef}>
                <Document
                  file="/assets/cv.pdf"
                  onLoadSuccess={onDocLoadSuccess}
                  loading={<div className="cv-status">Loading CV…</div>}
                  error={
                    <div className="cv-status">
                      Couldn't render the preview.{' '}
                      <a href="/assets/cv.pdf" download>Download the PDF instead</a>.
                    </div>
                  }
                >
                  {Array.from({ length: numPages ?? 0 }, (_, index) => (
                    <div className="cv-page" key={index}>
                      <Page
                        pageNumber={index + 1}
                        width={pageWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        loading={<div className="cv-page-skeleton" style={{ width: pageWidth, height: pageWidth * 1.414 }} />}
                      />
                      <span className="cv-page-num">{index + 1} / {numPages}</span>
                    </div>
                  ))}
                </Document>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-footer-note">
        <p>© 2026 • Nathan Manley</p>
        <p>All Rights Reserved</p>
      </div>
    </motion.div>
  );
}
