import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TbBrandLinkedin, TbBrandGithub } from 'react-icons/tb';
import { pageTransition, fadeUp, staggerContainer, staggerItem } from '../motion/variants';
import RevealSection from '../motion/RevealSection';
import TimelineLogo from '../components/TimelineLogo';
import { timelineEvents } from '../data/timelineData';
import './About.css';

const headlineWords = ['Engineer.', 'Builder.', 'Innovator.'];

const quickFacts = [
  { label: 'From', value: 'Cork, Ireland' },
  { label: 'Attending', value: 'University College Cork' },
  { label: 'Studying', value: 'Engineering (CK600)' },
  { label: 'Currently', value: 'SWUX Design Intern @ Logitech' },
  { label: 'Building Since', value: '2014 — first CoderDojo at 8' },
  { label: 'Focus', value: 'Electronics & embedded systems' },
  { label: 'Also Into', value: 'AI, rocketry, motorsport' },
  { label: 'Awarded', value: 'CETB Dick Langford Award' },
];

export default function About() {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end end'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <motion.div className="about-page" variants={pageTransition} initial="hidden" animate="show" exit="exit">
      <section className="about-hero">
        <div className="about-hero-row">
          <motion.div className="about-hero-intro" variants={fadeUp} initial="hidden" animate="show">
            <p className="about-eyebrow">Who I Am</p>
            <p className="about-intro">
              I'm Nathan Manley, a 20-year-old engineering student at UCC with a decade-long habit
              of turning ideas into working hardware and software. From CanSat avionics to
              hackathon-winning apps, I care about practical systems: things that ship, and things
              that hold up outside pitch decks.
            </p>
            <a className="hero-readmore" href="#more">Read More ↓</a>
          </motion.div>

          <div className="about-hero-photo">
            <div className="about-hero-circle" aria-hidden="true" />
            <motion.img
              src="./assets/nathan.webp"
              alt="Nathan Manley"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <motion.div
            className="about-hero-headline"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {headlineWords.map((word) => (
              <motion.span key={word} className="headline-line" variants={staggerItem}>
                {word}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <div className="about-hero-bottom">
          <div className="hero-socials">
            <a href="https://www.linkedin.com/in/nathan-manley" target="_blank" rel="noreferrer" aria-label="LinkedIn"><TbBrandLinkedin /></a>
            <a href="https://github.com/MacManley" target="_blank" rel="noreferrer" aria-label="GitHub"><TbBrandGithub /></a>
          </div>
          <p className="hero-location">Cork, Ireland</p>
        </div>
      </section>

      <section id="more" className="about-more">
        <div className="about-more-column about-timeline-column">
          <div className="about-more-heading">
            <p className="page-eyebrow">My Journey</p>
            <h2>Timeline</h2>
          </div>
          <div className="timeline-list" ref={timelineRef}>
            <div className="timeline-track">
              <div className="timeline-track-fill" />
              <motion.div className="timeline-track-progress" style={{ height: lineHeight }} />
            </div>
            {timelineEvents.map((event, i) => (
              <motion.div
                key={i}
                className="timeline-row"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <TimelineLogo src={event.logo} alt={event.title} />
                <div className="timeline-row-content">
                  <span className="timeline-year">{event.year}</span>
                  <h3 className="timeline-event-title">{event.title}</h3>
                  <p className="timeline-event-desc">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="about-more-column about-cards-column">
          <RevealSection className="about-card about-card-facts" delay={0}>
            <h3>At a Glance</h3>
            <dl className="about-facts">
              {quickFacts.map((fact) => (
                <div className="fact-cell" key={fact.label}>
                  <dt className="fact-label">{fact.label}</dt>
                  <dd className="fact-value">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </RevealSection>

          <RevealSection className="about-card" delay={0.06}>
            <h3>Background</h3>
            <p>
              I'm currently studying Engineering at UCC after a successful Leaving Certificate, for which I received the CETB Dick
              Langford Leaving Certificate Award for my results. Through engineering, I'm building on my foundation in electronics,
              programming, and problem-solving across business, software, and hardware projects.
            </p>
          </RevealSection>

          <RevealSection className="about-card" delay={0.12}>
            <h3>Skills & Interests</h3>
            <ul className="about-skills">
              <li><strong>Electronics:</strong> Circuit design, microcontroller programming, sensor integration</li>
              <li><strong>Programming:</strong> Python, C++, SwiftUI, JavaScript</li>
              <li><strong>Software Development:</strong> C++ library design, React and Electron app development</li>
              <li><strong>3D Design:</strong> Autodesk Fusion 360, 3D printing</li>
              <li><strong>Robotics:</strong> VEX Robotics, CanSat competitions, autonomous systems</li>
            </ul>
          </RevealSection>

          <RevealSection className="about-card about-card-highlight" delay={0.18}>
            <h3>Goals</h3>
            <p>
              I'm excited to apply my skills to practical projects, especially AI, rocketry, motorsport,
              and the intersection of electronics and software.
            </p>
          </RevealSection>
        </div>
      </section>

      <div className="about-footer-note">
        <p>© 2026 • Nathan Manley</p>
        <p>All Rights Reserved</p>
      </div>
    </motion.div>
  );
}
