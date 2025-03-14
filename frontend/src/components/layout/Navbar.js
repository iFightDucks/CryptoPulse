import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  
  return (
    <nav className={`navbar ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container">
        <Link to="/" className="navbar-brand">Crypto AI Analyzer</Link>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row">
          <li className="nav-item mx-2">
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>
        </ul>
        <button className="btn btn-outline-primary" onClick={toggleTheme}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;