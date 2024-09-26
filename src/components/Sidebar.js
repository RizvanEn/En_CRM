import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Material Dashboard 2</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard" className="menu-item active">
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/dashboard/booking" className="menu-item">
            <i className="fas fa-book"></i>
            Booking
          </Link>
        </li>
        <li>
          <Link to="/dashboard/history" className="menu-item">
            <i className="fas fa-history"></i>
            History
          </Link>
        </li>
        <li>
          <Link to="/dashboard/new-booking" className="menu-item">
            <i className="fas fa-plus-circle"></i>
            New Booking
          </Link>
        </li>
      </ul>
      <button className="sidebar-upgrade-btn">Upgrade to Pro</button>
    </div>
  );
};

export default Sidebar;
