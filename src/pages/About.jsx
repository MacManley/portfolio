import { useEffect, useRef } from 'react';
import './About.css';

const timelineEvents = [
  {
    year: 'September 2014',
    title: 'First CoderDojo Session',
    description: 'Attended my first CoderDojo session at age 8. The spark that started everything.',
  },
  {
    year: '2016-2018',
    title: 'Coolest Projects',
    description: 'Entered 1 software and 2 hardware projects in 3 consecutive years of Coolest Projects. Various projects spanning cargo container calculators, to medication dispensers.',
  },
  {
    year: '2023-2024',
    title: 'CanSat Competition',
    description: 'Designed and launched a CanSat, integrating sensors, telemetry, and recovery systems. Won regional competition.',
  },
  {
    year: 'July 2024 - September 2024',
    title: 'Patch 2024',
    description: 'One of thirty people selected for Patch 2024, a startup accelerator program. Co-founded Gymificient, an actionable analytics platform for gyms, and pitched at Demo Day.',
  },
  {
    year: '2024 - 2025',
    title: 'Leaving Certificate',
    description: 'Took a break from project work to focus on preparing for the Leaving Certificate, achieving 589/625 points.',
  },
  {
    year: 'February 2026',
    title: 'National SDG Hackathon Winner',
    description: 'Won €4K in prize money over two SDG hackathons (regional and national) with the idea Remento.',
  },
  {
    year: 'March 2026',
    title: 'CETB Dick Langford Award',
    description: 'Received the CETB Dick Langford Leaving Certificate Award for outstanding results.',
  },
  // {
  //   year: 'September 2025 - Present',
  //   title: 'Engineering @ UCC',
  //   description: 'Studying Engineering (CK600) at University College Cork.',
  // },
  {
    year: 'September 2025 - Present',
    title: 'UCC Rocketry and Space Society',
    description: 'Academic officer for rocketry society. Head of CanSat avionics development for the engineering team.',
  },
  {
    year: 'March 2026 - Present',
    title: 'UCC Student Entrepreneur of the Year Finalist',
    description: 'Finalist in the UCC Student Entrepreneur of the Year competition, recognised for entrepreneurial and innovative initiatives on campus.',
  },
  {
    year: 'January 2026 - Present',
    title: 'OnSite',
    description: 'Founder of OnSite, the all-in-one mobile app for tradespeople.',
  },
  // {
  //   year: 'April 2026 - Present',
  //   title: 'Quercus Innovation and Entrepreneurial Scholar',
  //   description: 'UCC Quercus Innovation and Entreprenurship Scholar for the duration of my undergraduate.',
  // },
].reverse();

export default function About() {
  const timelineRef = useRef(null);
  const lineGlowRef = useRef(null);

  // Animate cards in on scroll
  useEffect(() => {
    const items = timelineRef.current?.querySelectorAll('.timeline-item');
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  // Drive the neon line fill based on scroll position
  useEffect(() => {
    const onScroll = () => {
      const timeline = timelineRef.current;
      const glow = lineGlowRef.current;
      if (!timeline || !glow) return;

      const nodes = timeline.querySelectorAll('.timeline-node');
      const lastNode = nodes[nodes.length - 1];
      if (!lastNode) return;

      const rect = timeline.getBoundingClientRect();
      const lastNodeRect = lastNode.getBoundingClientRect();

      // Distance from timeline top to the centre of the last node (fixed regardless of scroll)
      const lastNodeTarget = lastNodeRect.top + lastNodeRect.height / 2 - rect.top;
      // How far past the timeline top the 55% viewport point currently is
      const scrolled = window.innerHeight * 0.55 - rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / lastNodeTarget));
      glow.style.height = `${progress * 100}%`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

      <section className="timeline-section">
        <div className="timeline-header">
          <p className="page-eyebrow">My Journey</p>
          <h2 className="timeline-title">Timeline</h2>
        </div>
        <div className="timeline" ref={timelineRef}>
          {timelineEvents.map((event, i) => (
            <div key={i} className={`timeline-item ${i % 2 === 0 ? 'timeline-left' : 'timeline-right'}`} style={{ '--delay': `${i * 0.08}s` }}>
              <div className="timeline-card">
                <span className="timeline-year">{event.year}</span>
                <h3 className="timeline-event-title">{event.title}</h3>
                <p className="timeline-event-desc">{event.description}</p>
              </div>
              <div className="timeline-node" />
            </div>
          ))}
          <div className="timeline-line" />
          <div className="timeline-line-glow" ref={lineGlowRef} />
        </div>
      </section>

      <div className="about-footer-note">
        <p>© 2026 • Nathan Manley</p>
        <p>All Rights Reserved</p>
      </div>
    </div>
  );
}