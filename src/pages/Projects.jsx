import { useState } from "react";
import { motion } from "framer-motion";
import ProjectsView from "../components/ViewProjects";
import { pageTransition } from "../motion/variants";
import '../index.css'

const categories = ['All', 'Hardware', 'Software'];

function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');

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
     <div className="filters">
       <div className="type-filter-row">
         {categories.map((category) => (
           <button
             key={category}
             className={`button-main filter-pill type-pill ${selectedCategory === category ? 'filter-pill-active' : ''}`}
             onClick={() => setSelectedCategory(category)}
           >
             {category}
           </button>
         ))}
       </div>
     </div>
     <div className="projects-roundup">
      <ProjectsView categoryFilter={selectedCategory} />
      </div>

      <div className="page-footer-note">
        <p>© 2026 • Nathan Manley</p>
        <p>All Rights Reserved</p>
      </div>
     </motion.div>
   );
 }

export default Projects;
