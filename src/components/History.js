import React, { useEffect, useState } from 'react';
import './History.css';
import BookingForm from './NewBooking'; // Assuming you have the BookingForm component
import Popup from './Popup'; // Importing the Popup component

const BaseUrl = 'https://crm-backend-6kqk.onrender.com';

const History = () => {
  const [bookings, setBookings] = useState([]); // Initialize bookings as an empty array
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(''); // Store the logged-in user's ID
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility
  const [editBooking, setEditBooking] = useState(null); // State to hold the booking to be edited

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    if (userSession && userSession.user_id) {
      setUserRole(userSession.user_role); // Set user role
      setUserId(userSession.user_id); // Set user ID
      fetchAllBookings(userSession); // Pass userSession to the function
    } else {
      console.error('User session not found.');
      setLoading(false);
    }
  }, []);

  const fetchAllBookings = (userSession) => {
    setLoading(true);
    fetch(`${BaseUrl}/booking/all`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.Allbookings) {
          // Filter bookings based on user role
          const filteredBookings = data.Allbookings.filter(booking => {
            // Admin roles can see all bookings
            if (['admin', 'dev', 'senior admin'].includes(userSession.user_role)) {
              return true; // Show all bookings for these roles
            } 
            // Other roles should only see their own bookings
            else {
              return booking.createdBy === userSession.user_id; // Show only bookings created by the user
            }
          });

          setBookings(filteredBookings); // Set filtered bookings
        } else {
          console.error('Expected bookings data but got:', data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleEditClick = (booking) => {
    // Open the popup and set the current booking to be edited
    setEditBooking(booking);
    setIsPopupOpen(true);
  };

  const handleCreateBooking = () => {
    setEditBooking(null); // No booking data, creating new booking
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditBooking(null); // Clear the current booking on popup close
  };

  // Function to handle search functionality
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      const userSession = JSON.parse(localStorage.getItem('userSession')); // Fetch userSession again for search
      fetchAllBookings(userSession); // Fetch all bookings if the search query is empty
    } else {
      const filteredBookings = bookings.filter(booking =>
        booking.company_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setBookings(filteredBookings);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="history-page">
      <h2 className="history-header">
        <span className="history-icon">🔄</span> History
      </h2>
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search by company name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="actions">
        <button className="create-button" onClick={handleCreateBooking}>
          Create New Booking
        </button>
      </div>

      <div className="booking-list">
        {bookings.map((booking) => (
          <div className="booking-item" key={booking._id}>
            <div className="booking-details">
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>BOOKING ID:</strong> {booking._id}</p>
              <p><strong>Service:</strong> {booking.services}</p>
              <p><strong>Company Name:</strong> {booking.company_name}</p>
              <p><strong>Contact Person:</strong> {booking.contact_person}</p>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Contact Number:</strong> {booking.contact_no}</p>
              <p><strong>Total Amount:</strong> {booking.total_amount}</p>
              <p><strong>Received Amount:</strong> {booking.term_1 + booking.term_2 + booking.term_3}</p>
            </div>
            {/* Show the Edit button only for dev, senior admin, and admin */}
            {['dev', 'senior admin', 'admin'].includes(userRole) && (
              <div className="booking-edit">
                <button className="edit-link" onClick={() => handleEditClick(booking)}>Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="total-bookings">
        Total Bookings: {bookings.length}
      </div>

      {/* Popup for Edit Form */}
      {isPopupOpen && (
        <Popup isOpen={isPopupOpen} onClose={closePopup}>
          {/* Pass the booking details to BookingForm as props */}
          <BookingForm
            initialData={editBooking} // Pass the booking data to be edited, null if creating new booking
            userRole={userRole} // Pass the user role to control form behavior
            onClose={closePopup} // Callback to close popup after form submission
          />
        </Popup>
      )}
    </div>
  );
};

export default History;
