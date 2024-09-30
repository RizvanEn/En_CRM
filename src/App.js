import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './components/LoginSignup';
import Dashboard from './Pages/Dashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { SnackbarProvider} from 'notistack';

const LOGIN_DURATION = 20 * 60 * 60 * 1000; // 20 hours in milliseconds

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize isAuthenticated from localStorage
    const loggedIn = localStorage.getItem('isAuthenticated');
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = Date.now();

    if (loggedIn && loginTime && currentTime - loginTime <= LOGIN_DURATION) {
      return true;  // Return true if user is still within session duration
    }
    return false;  // Otherwise return false
  });

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
    <SnackbarProvider>
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
    </SnackbarProvider>
  );
}

export default App;
