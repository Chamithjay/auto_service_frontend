import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthNavbar from './AuthNavbar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <AuthNavbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
