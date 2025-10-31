import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthNavbar.css';

const AuthNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="auth-navbar">
      <div className="auth-navbar-container">
        <div className="auth-navbar-brand">
          <Link to="/dashboard">
            <h2>🚗 Auto Service</h2>
          </Link>
        </div>
        
        <div className="auth-navbar-menu">
          <Link to="/dashboard" className={isActive('/dashboard')}>
            Dashboard
          </Link>
          <Link to="/vehicles" className={`${isActive('/vehicles')} ${location.pathname.startsWith('/vehicles') ? 'active' : ''}`}>
            Vehicles
          </Link>
          <Link to="/profile" className={isActive('/profile')}>
            Profile
          </Link>
        </div>

        <div className="auth-navbar-user">
          <span className="user-name">👤 {user?.username}</span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
