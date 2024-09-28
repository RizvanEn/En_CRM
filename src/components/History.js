import React, { useEffect, useState } from 'react';
import './History.css';
import AddBooking from './EditBooking'; // Assuming you have the AddBooking component
import EditBooking from './EditBooking'; // Import the EditBooking component
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
    
    // Log user session for debugging
    console.log('Fetching bookings for user session:', userSession);

    // Fetch all bookings for admin, dev, senior admin; else fetch user-specific bookings
    const url = ['admin', 'dev', 'senior admin'].includes(userSession.user_role)
      ? `${BaseUrl}/booking/all`
      : `${BaseUrl}/user/bookings/${userSession.user_id}`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Log the data received from the API for debugging
        console.log('Data received from API:', data);

        // For admin, dev, senior admin, use `Allbookings`, else use data directly
        const bookingsData = data.Allbookings || data;

        if (bookingsData && bookingsData.length > 0) {
          setBookings(bookingsData); // Set the fetched bookings
        } else {
          console.error('No bookings found.');
          setBookings([]); // Set an empty array if no bookings are found
        }

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleEditClick = (booking) => {
    setEditBooking(booking);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditBooking(null); // Clear the current booking on popup close
    fetchAllBookings(JSON.parse(localStorage.getItem('userSession'))); // Fetch updated bookings
  };

  // Function to handle the delete booking
  const handleDeleteClick = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      fetch(`${BaseUrl}/booking/deletebooking/${bookingId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error deleting the booking');
          }
          // Filter out the deleted booking from the state
          setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
          alert('Booking deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting booking:', error);
          alert('Failed to delete booking.');
        });
    }
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
        {/* <span className="history-icon">🔄</span>  */}
        All Bookings
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
              <p><strong>Gst</strong> {booking.gst}</p>
            </div>
            {/* Show the Edit button and Delete button only for dev, senior admin, and admin */}
            {['dev', 'senior admin', 'admin'].includes(userRole) && (
              <div className="booking-edit">
                <button className="edit-link" onClick={() => handleEditClick(booking)}>Edit</button>
                <button className="delete-link" onClick={() => handleDeleteClick(booking._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="total-bookings">
        Total Bookings: {bookings.length}
      </div>

      {/* Popup for Add or Edit Form */}
      {isPopupOpen && (
        <Popup isOpen={isPopupOpen} onClose={closePopup}>
          {editBooking ? (
            <EditBooking
              initialData={editBooking} // Pass the booking data to be edited
              onClose={closePopup} // Callback to close popup after form submission
            />
          ) : (
            <AddBooking onClose={closePopup} /> // Render AddBooking if creating new booking
          )}
        </Popup>
      )}
    </div>
  );
};

export default History;
