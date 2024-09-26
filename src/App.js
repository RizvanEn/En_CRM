import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './components/LoginSignup';
import Dashboard from './Pages/Dashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';


const LOGIN_DURATION = 20 * 60 * 60 * 1000; // 20 hours in milliseconds

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated');
    const loginTime = localStorage.getItem('loginTime');

    if (loggedIn && loginTime) {
      const currentTime = Date.now();
      if (currentTime - loginTime > LOGIN_DURATION) {
        handleLogout(); // Log out if more than 20 hours have passed
      } else {
        setIsAuthenticated(true); // Stay logged in
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');  // Save login state in localStorage
    localStorage.setItem('loginTime', Date.now()); // Store the login timestamp
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');  // Remove login state
    localStorage.removeItem('loginTime');  // Remove login timestamp
  };

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginSignup onLoginSuccess={handleLoginSuccess} />}
      />
      <Route
        path="/dashboard/*"  // Wildcard * to handle all nested routes
        element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
