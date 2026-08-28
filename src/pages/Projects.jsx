import { motion } from "framer-motion";
import ProjectShowcase from "../components/ProjectShowcase";
import { projects } from "../data/projectsData";
import { pageTransition } from "../motion/variants";
import './Projects.css';

function Projects() {
  return (
    <motion.div className="projects-page" variants={pageTransition} initial="hidden" animate="show" exit="exit">
      <div className="projects-header page-header">
        <p className="page-eyebrow">WHAT I WORK ON</p>
        <h1 className="page-title">Projects</h1>
        <p className="page-description">
          A snapshot of software, hardware, and AI builds across hackathons,
          engineering, and personal projects.
        </p>
      </div>

      <div className="projects-roundup">
        <ProjectShowcase projects={projects} />
      </div>

      <div className="page-footer-note">
        <p>© 2026 • Nathan Manley</p>
        <p>All Rights Reserved</p>
      </div>
    </motion.div>
  );
}

export default Projects;
