import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import './index.css';

const navItems = [
  { to: '/', label: 'About' },
  { to: '/projects', label: 'Portfolio' },
  { to: '/contact', label: 'Contact' }
];

function App() {
  const location = useLocation();
  const linksRef = useRef({});
  const [bubbleStyle, setBubbleStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const syncBubble = () => {
    const activePath = location.pathname;
    const activeLink = linksRef.current[activePath];
    if (!activeLink) {
      return;
    }
    setBubbleStyle({
      left: activeLink.offsetLeft,
      width: activeLink.offsetWidth,
      opacity: 1
    });
  };

  useLayoutEffect(() => {
    syncBubble();
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => syncBubble();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <nav className="top-navigation">
        <div className="nav-shell">
          <div className="nav-links">
            <span
              className="nav-bubble"
              style={{
                width: bubbleStyle.width,
                transform: `translateX(${bubbleStyle.left}px)`,
                opacity: bubbleStyle.opacity
              }}
            />
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="nav-link"
                ref={(el) => {
                  if (el) {
                    linksRef.current[item.to] = el;
                  }
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="nav-logo" aria-hidden="true">
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
      {/* <div className="rr">
      <h6>© 2026 • Nathan Manley</h6>
      <h6>All Rights Reserved</h6>
      </div> */}
    </div>
  );
}

export default App;