import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart'; // Ensure you have these chart components
import './DashboardContent.css';

const BaseUrl = 'https://crm-backend-6kqk.onrender.com'; // Your backend URL

const DashboardContent = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0); // State to store total revenue
  const [userRole, setUserRole] = useState(''); // Keep userRole if needed for conditional rendering
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('userSession'));

    if (userSession && userSession.user_id) {
      setUserRole(userSession.user_role);
      fetchTotalBookings(userSession); // Fetch total bookings and calculate revenue
    } else {
      console.error('User session not found.');
      setLoading(false);
    }
  }, []);

  // Fetch total bookings and calculate total revenue
  const fetchTotalBookings = (userSession) => {
    setLoading(true);

    // Construct the correct API endpoint based on user role
    const url = ['admin', 'dev', 'senior admin'].includes(userSession.user_role)
      ? `${BaseUrl}/booking/all`
      : `${BaseUrl}/user/bookings/${userSession.user_id}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const bookingsData = data.Allbookings || data;

        // Calculate the total bookings and revenue
        const totalBookingCount = bookingsData.length || 0;
        const totalRevenueAmount = bookingsData.reduce((acc, booking) => acc + booking.total_amount, 0);

        setTotalBookings(totalBookingCount);
        setTotalRevenue(totalRevenueAmount);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching total bookings:', error);
        setLoading(false);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Top Row: Stats Cards */}
      <div className="stats-row">
        <div className="card">
          <div className="card-icon bookings-icon">
            <i className="fas fa-briefcase"></i>
          </div>
          <div className="card-info">
            <h3>Bookings</h3>
            <p>{totalBookings}</p>
            <span className="card-update">Your Total Bookings</span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon users-icon">
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="card-info">
            <h3>Total Users</h3>
            <p>2,300</p>
            <span className="card-update">+3% than last month</span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon revenue-icon">
            <i className="fas fa-store"></i>
          </div>
          <div className="card-info">
            <h3>Revenue</h3>
            <p>{totalRevenue.toLocaleString()} INR</p>
            <span className="card-update">Total Revenue</span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon followers-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="card-info">
            <h3>Followers</h3>
            <p>+91</p>
            <span className="card-update">Just updated</span>
          </div>
        </div>
      </div>

      {/* Conditionally render content based on userRole */}
      {userRole === 'admin' && (
        <div className="admin-section">
          <h4>Admin Dashboard Section</h4>
          {/* Additional content for admin users */}
        </div>
      )}

      {/* Middle Row: Charts */}
      <div className="charts-row">
        <div className="chart-container line-chart">
          <LineChart />
          <h4>Website Views</h4>
          <p>Last Campaign Performance</p>
        </div>
        <div className="chart-container green-chart">
          <LineChart />
          <h4>Daily Sales</h4>
          <p>(+15%) increase in today’s sales</p>
        </div>
        <div className="chart-container dark-chart">
          <LineChart />
          <h4>Completed Tasks</h4>
          <p>Last Campaign Performance</p>
        </div>
      </div>

      {/* Bottom Row: Projects and Orders */}
      <div className="bottom-row">
        <div className="projects">
          <h4>Projects</h4>
          <p>30 done this month</p>
          <div className="project-details">
            <div className="project">
              <span className="company-name">Material UI XD Version</span>
              <span className="budget">$14,000</span>
              <span className="completion">60%</span>
            </div>
            <div className="project">
              <span className="company-name">Add Progress Track</span>
              <span className="budget">$3,000</span>
              <span className="completion">30%</span>
            </div>
          </div>
        </div>
        <div className="orders-overview">
          <h4>Orders Overview</h4>
          <div className="order-item">
            <span className="order-status green"></span>
            <span className="order-desc">$2400, Design changes</span>
            <span className="order-date">22 Dec 7:20 PM</span>
          </div>
          <div className="order-item">
            <span className="order-status red"></span>
            <span className="order-desc">New order #1832412</span>
            <span className="order-date">21 Dec 11 PM</span>
          </div>
          <div className="order-item">
            <span className="order-status blue"></span>
            <span className="order-desc">Server payments for April</span>
            <span className="order-date">21 Dec 11 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
