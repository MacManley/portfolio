import { useState } from "react";
import DropdownMenu from "../components/Dropdown";
import Status from "../components/StatusButtons"
import ProjectsView from "../components/ViewProjects";
import '../index.css'

function Projects() {
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
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
       <div className="filters-row">
         <DropdownMenu selectedTechnology={selectedTechnology}
                       setSelectedTechnology={setSelectedTechnology} />
         <Status selectedStatus={selectedStatus}
                 setSelectedStatus={setSelectedStatus} />
       </div>
     </div>
     <div className="projects-roundup">
      <ProjectsView technologyFilter={selectedTechnology}
                    statusFilter={selectedStatus}/>
      </div>
     </div>
   );
 }

export default Projects;