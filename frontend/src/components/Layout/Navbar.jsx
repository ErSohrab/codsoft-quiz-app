import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, resolvedTheme, setTheme, systemTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <h1>Quiz App</h1>
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="theme-switcher">
            <label htmlFor="theme-select" className="theme-label">
              Theme
            </label>
            <select
              id="theme-select"
              className="theme-select"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
            >
              <option value="system">System ({systemTheme})</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <span className="theme-indicator">{resolvedTheme}</span>
          </div>
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="menu-link">
                  Admin Dashboard
                </Link>
              )}
              <div className="user-info">
                <span>Welcome, {user?.username}</span>
                <span className="role-badge">{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="menu-link">
                Login
              </Link>
              <Link to="/register" className="menu-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
