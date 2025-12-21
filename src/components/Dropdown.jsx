import { useState, useRef, useEffect } from 'react';
import './Dropdown.css';
import '../index.css'
import { projects, techIconMap } from '../data/projectsData';
import { TbFilterFilled } from 'react-icons/tb';

function DropdownMenu({ selectedTechnology, setSelectedTechnology }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  var languages = []; 
    projects.forEach(project => {
        project.technologyUsed.forEach(tech => {
          if (!languages.includes(tech)) {
            languages.push(tech);
          }
        });
      });
        
    function handleSelectedTechnology(technology) {
      setSelectedTechnology(technology === selectedTechnology ? null : technology);
      setOpen(false);
    }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={menuRef}>
      <button className="button-main" onClick={() => setOpen(!open)}>
        <span>Technologies</span><span> <TbFilterFilled color="#FFEE8C"/></span>
      </button>

      {open && (
        <div className="dropdown-menu">
          {languages.sort().map((technology) => (
          <div key={technology} className={`dropdown-item ${selectedTechnology == technology ? "dropdown-item-active" : ""}`} onClick={() => handleSelectedTechnology(technology)}><span>{technology}</span><span>     {techIconMap[technology] || 'n'}</span></div>
        ))}
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;