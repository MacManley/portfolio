import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import './index.css';

const navItems = [
  { to: '/', label: 'About' },
  { to: '/projects', label: 'Portfolio' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <header className="site-header">
        <Link to="/" className="site-wordmark">nathan manley.</Link>
        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span className="nav-underline" layoutId="nav-underline" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="content">
        <main className="main-section">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
