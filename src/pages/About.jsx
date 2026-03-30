import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-header page-header">
        <p className="page-eyebrow">Who I Am</p>
        <h1 className="page-title">About</h1>
        <p className="page-description">
          Engineering student focused on building practical systems that blend
          software and hardware.
        </p>
      </div>

      <header className="about-hero">
        <div className="about-identity-card">
          <div className="about-profile-image">
            <img src="./assets/nathan.png" alt="Nathan Manley" />
          </div>
          <div className="about-profile-info">
            <p className="about-eyebrow">Engineer • Builder • Mentor</p>
            <h1>Nathan Manley</h1>
            <h2>Engineering @ UCC</h2>
            <p className="about-intro">Passionate innovator with a strong foundation in electronics, programming, and practical problem solving.</p>
            <p className="about-location">Cork, Ireland</p>
          </div>
          <div className="about-profile-spacer" aria-hidden="true" />
        </div>
      </header>

      <section className="about-grid">
        <article className="about-card">
          <h3>About Me</h3>
          <p>
            I&apos;m a 19-year-old engineering student at UCC with a passion for electronics, microcontrollers, and motorsport.
            My journey began early, when I attended my first CoderDojo session at 8 years old.
          </p>
        </article>

        <article className="about-card">
          <h3>Background</h3>
          <p>
            I&apos;m currently studying Engineering at UCC after a successful Leaving Certificate, for which I received the CETB Dick
            Langford Leaving Certificate Award for my results. Through engineering, I&apos;m building on my foundation in electronics,
            programming, and problem-solving across business, software, and hardware projects.
          </p>
        </article>

        <article className="about-card about-card-wide">
          <h3>Skills & Interests</h3>
          <ul className="about-skills">
            <li><strong>Electronics:</strong> Circuit design, microcontroller programming, sensor integration</li>
            <li><strong>Programming:</strong> Python, C++, SwiftUI, JavaScript</li>
            <li><strong>3D Design:</strong> Autodesk Fusion 360, 3D printing</li>
            <li><strong>Robotics:</strong> VEX Robotics, CanSat competitions, autonomous systems</li>
            <li><strong>Software Development:</strong> C++ library design, mobile and web app development</li>
          </ul>
        </article>

        <article className="about-card about-card-highlight">
          <h3>Goals</h3>
          <p>
            I&apos;m excited to keep strengthening my skills in engineering, especially in fitness tech, rocketry, motorsport,
            and the intersection of electronics and software. I also continue to mentor at CoderDojo Glanmire, where my
            passion for programming and innovation first began.
          </p>
        </article>
      </section>

      <div className="about-footer-note">
        <p>© 2026 • Nathan Manley</p>
        <p>All Rights Reserved</p>
      </div>
    </div>
  );
}