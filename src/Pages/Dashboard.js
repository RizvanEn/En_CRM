import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardContent from '../components/DashboardContent';
import BookingList from '../components/BookingList';
import NewBooking from '../components/NewBooking';
import History from '../components/History';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h1>Dashboard</h1>
          <p>Welcome to your dashboard. Here you can view your statistics and manage your data.</p>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>

        {/* Routes */}
        <Routes>
          {/* Render all the content in DashboardContent */}
          <Route path="/" element={<DashboardContent />} />
          
          {/* Other pages */}
          <Route path="booking" element={<BookingList />} />
          <Route path="new-booking" element={<NewBooking />} />
          <Route path="history" element={<History />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
