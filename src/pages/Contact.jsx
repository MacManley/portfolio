import { useState } from 'react';
import "../components/ViewProjects.css"
import {techIconMap} from "../data/projectsData.jsx"

export default function Contact() {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  return (
    <div className="contact-container">
      <h2>Get In Touch</h2>
      <div className="contact-content">
        <div className="contact-section">
          <h3>Contact Information</h3>
           <div className="contact-item">
            <div className="contact-icons">
              <div className="contact-icon" alt="LinkedIn" title="LinkedIn" onClick={() => window.open("https://www.linkedin.com/in/nathan-manley", "_blank")}><span>LinkedIn</span> <span> {techIconMap['LinkedIn']}</span></div>
              <div className="contact-icon" alt="Github" title="Github" onClick={() => window.open("https://github.com/MacManley", "_blank")}><span>GitHub</span><span> {techIconMap['GitHub']}</span></div>
            </div>
            </div>
          <div className="contact-item">
            <button className="button-main" onClick={() => setModalOpen(true)}>
              Contact Me
            </button>
          </div>
        </div>
        <div className="contact-section">
          <h3>Let's Connect</h3>
          <p>
            I'm always interested in new opportunities, collaborations, and interesting projects.
            Whether you have a question about my work, want to discuss potential projects,
            or just want to say hello, feel free to reach out!
          </p>
        </div>
      </div>
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: 400}}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
            <form
              className="contact-form"
              action="https://formspree.io/f/mrblrppa"
              method="POST"
            >
              {/* TODO: honeypot */}
              <input type="text" name="website" style={{display: 'none'}} tabIndex="-1" autoComplete="off" />
              <h3>Contact Me</h3>
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className={emailTouched && !isEmailValid ? 'input-error' : ''}
              />
              {emailTouched && !isEmailValid && (
                <span className="input-error-message">Please enter a valid email address.</span>
              )}
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
              />
              <button className="button-main" type="submit" disabled={!isEmailValid}>Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 