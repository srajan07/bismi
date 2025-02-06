import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

const API_BASE_URL = "http://localhost:5000"; // Update if needed

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newBooking, setNewBooking] = useState({
    name: "",
    selectedDate: "",
    selectedTime: "",
    guestCount: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();

  // Check for admin token on mount. If not present, redirect to /login.
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch Bookings on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      const fetchBookings = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Ensure the keys match what your backend returns:
          // booking_id, name, selected_date, selected_time, guest_count, phone_number, status
          setBookings(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching bookings:", err.response?.data || err.message);
          setError("Error fetching bookings");
          setLoading(false);
          // If token is invalid or expired, clear it and redirect to login
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            localStorage.removeItem("adminToken");
            navigate("/login");
          }
        }
      };
      fetchBookings();
    }
  }, [navigate]);

  // Handle changes for the new booking form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking((prevBooking) => ({ ...prevBooking, [name]: value }));
  };

  // Submit a new booking (admin only)
  const handleNewBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const customBookingId = `BOOK-${Date.now()}`;
      // The API endpoint for admin-created bookings
      const response = await axios.post(
        `${API_BASE_URL}/api/bookings`,
        { bookingId: customBookingId, ...newBooking },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("New booking added:", response.data);
      // Create an object with keys matching what the backend returns
      const addedBooking = {
        booking_id: response.data.bookingId,
        name: newBooking.name,
        selected_date: newBooking.selectedDate,
        selected_time: newBooking.selectedTime,
        guest_count: newBooking.guestCount,
        phone_number: newBooking.phoneNumber,
        status: "Pending",
      };
      setBookings((prevBookings) => [...prevBookings, addedBooking]);
      // Clear the form fields
      setNewBooking({
        name: "",
        selectedDate: "",
        selectedTime: "",
        guestCount: "",
        phoneNumber: "",
      });
    } catch (err) {
      console.error("Error adding booking:", err.response?.data || err.message);
      setError("Error adding booking");
    }
  };

  // Update booking status (e.g., Confirm or Cancel)
  const handleBookingStatusChange = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${API_BASE_URL}/api/bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.booking_id === bookingId ? { ...booking, status } : booking
        )
      );
    } catch (err) {
      console.error("Error updating booking status:", err.response?.data || err.message);
      setError("Error updating booking status");
    }
  };

  // Remove a booking (admin only)
  const handleRemoveBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.booking_id !== bookingId)
      );
    } catch (err) {
      console.error("Error deleting booking:", err.response?.data || err.message);
      setError("Error deleting booking");
    }
  };

  // Logout handler: remove token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard - Manage Bookings</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
     
      {error && <div className="error-message">{error}</div>}

      <h2>Create a Booking (Admin Only)</h2>
      <form onSubmit={handleNewBookingSubmit} className="add-booking-form">
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={newBooking.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="selectedDate"
          value={newBooking.selectedDate}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="selectedTime"
          value={newBooking.selectedTime}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="guestCount"
          placeholder="Guest Count"
          value={newBooking.guestCount}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={newBooking.phoneNumber}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Booking</button>
      </form>

      <h2>Current Bookings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Guest Count</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td>{booking.name || "N/A"}</td>
                <td>{booking.selected_date || "N/A"}</td>
                <td>{booking.selected_time || "N/A"}</td>
                <td>{booking.guest_count || "N/A"}</td>
                <td>{booking.phone_number || "N/A"}</td>
                <td>{booking.status || "Pending"}</td>
                <td>
                  {booking.status === "Pending" && (
                    <>
                      <button
                        className="confirm-btn"
                        onClick={() =>
                          handleBookingStatusChange(booking.booking_id, "Confirmed")
                        }
                      >
                        Confirm
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() =>
                          handleBookingStatusChange(booking.booking_id, "Cancelled")
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {(booking.status === "Confirmed" || booking.status === "Cancelled") && (
                    <button onClick={() => handleRemoveBooking(booking.booking_id)}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
