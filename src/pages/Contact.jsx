import { useState } from 'react';

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
            <strong>LinkedIn:</strong>
            <a href="https://linkedin.com/in/nathan-manley" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/nathan-manley
            </a>
          </div>
          <div className="contact-item">
            <strong>GitHub:</strong>
            <a href="https://github.com/macmanley" target="_blank" rel="noopener noreferrer">
              github.com/nathan-manley
            </a>
          </div>
          <p>Want to chat? Reach out!</p>
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
              {/* Honeypot field for spam protection */}
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