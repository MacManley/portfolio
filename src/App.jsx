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
          <NavLink to="/projects" className="nav-link">Portfolio</NavLink>
          <NavLink to="/contact" className="nav-link">Contact</NavLink>
          <div className="nav-logo">
          <img src="./assets/favicon.png" alt="Nathan Manley 2026"/>
        </div>
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
      <div className="rr">
      <h6>© 2026 • Nathan Manley</h6>
      <h6>All Rights Reserved</h6>
      </div>
    </div>
  );
}

export default App;