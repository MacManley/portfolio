import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProjectsView from "../components/ViewProjects";
import { projects } from "../data/projectsData";
import { pageTransition } from "../motion/variants";
import './Projects.css';

const categories = ['All', 'Hardware', 'Software'];

// Match rules kept as they were, but lifted here so the toolbar counts and the
// rendered grid can never drift apart.
function matchesCategory(project, category) {
  if (category === 'All') return true;
  if (category === 'Hardware') return project.type && project.type.includes('Hardware');
  if (category === 'Software') return !project.type || !project.type.includes('Hardware') || project.type.includes('Software');
  return true;
}

const pad = (value) => String(value).padStart(2, '0');

function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const counts = useMemo(
    () => Object.fromEntries(categories.map((category) => [category, projects.filter((p) => matchesCategory(p, category)).length])),
    []
  );

  const filteredProjects = useMemo(
    () => projects.filter((project) => matchesCategory(project, selectedCategory)),
    [selectedCategory]
  );

  return (
    <motion.div className="projects-page" variants={pageTransition} initial="hidden" animate="show" exit="exit">
      <div className="projects-header page-header">
        <p className="page-eyebrow">WHAT I WORK ON</p>
        <h1 className="page-title">Projects</h1>
        <p className="page-description">
          A snapshot of software, hardware, and AI builds across hackathons,
          student engineering, and personal product work.
        </p>
      </div>

      <div className="projects-toolbar">
        <p className="projects-count">
          <span className="count-current">{pad(filteredProjects.length)}</span>
          <span className="count-sep" aria-hidden="true">/</span>
          <span className="count-total">{pad(projects.length)}</span>
          <span className="count-label">Projects</span>
        </p>

        <div className="projects-filters" role="group" aria-label="Filter projects by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`projects-filter${selectedCategory === category ? ' is-active' : ''}`}
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              <span className="filter-label">{category}</span>
              <sup className="filter-count">{counts[category]}</sup>
              {selectedCategory === category && (
                <motion.span
                  className="filter-underline"
                  layoutId="filter-underline"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="projects-roundup">
        <ProjectsView projects={filteredProjects} categoryFilter={selectedCategory} />
      </div>

      <div className="page-footer-note">
        <p>© 2026 • Nathan Manley</p>
        <p>All Rights Reserved</p>
      </div>
    </motion.div>
  );
}

export default Projects;
