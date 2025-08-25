import { Routes, Route, NavLink } from 'react-router-dom';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <nav className="top-navigation">
        <div className="nav-links">
          <NavLink to="/" className="nav-link">About</NavLink>
          <NavLink to="/projects" className="nav-link">Projects</NavLink>
          <NavLink to="/contact" className="nav-link">Contact</NavLink>
        </div>
      </nav>
      
      <div className="content">
        <main className="main-section">
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;