import { useState } from "react";
import DropdownMenu from "../components/Dropdown";
import Status from "../components/StatusButtons"
import ProjectsView from "../components/ViewProjects";
import { jobTypes } from "../data/projectsData";
import { TbSearch, TbX } from 'react-icons/tb';
import '../index.css'

function Projects() {
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);

   return (
   <div className="projects-page">
    <div className="projects-header page-header">
       <p className="page-eyebrow">Built To Ship</p>
       <h1 className="page-title">Projects</h1>
       <p className="page-description">
         A snapshot of software, hardware, and AI builds across hackathons,
         student engineering, and personal product work.
       </p>
     </div>
     <div className="filters">
       <div className="search-bar-wrap">
         <TbSearch className="search-icon" />
         <input
           className="search-bar"
           type="text"
           placeholder="Search projects..."
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
         />
         {searchQuery && (
           <button className="search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
             <TbX />
           </button>
         )}
       </div>
       <div className="type-filter-row">
         {jobTypes.map((type) => (
           <button
             key={type}
             className={`button-main filter-pill type-pill ${selectedType === type ? 'filter-pill-active' : ''}`}
             onClick={() => setSelectedType(selectedType === type ? null : type)}
           >
             {type}
           </button>
         ))}
       </div>
       <div className="filters-row">
         <DropdownMenu selectedTechnology={selectedTechnology}
                       setSelectedTechnology={setSelectedTechnology} />
         <Status selectedStatus={selectedStatus}
                 setSelectedStatus={setSelectedStatus} />
       </div>
     </div>
     <div className="projects-roundup">
      <ProjectsView
        technologyFilter={selectedTechnology}
        statusFilter={selectedStatus}
        searchQuery={searchQuery}
        typeFilter={selectedType}
      />
      </div>
     </div>
   );
 }

export default Projects;