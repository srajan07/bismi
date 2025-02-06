import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Booking.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Booking() {
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState("");

  // Helper: Convert AM/PM time to 24-hour format if needed.
  // (If you use a native time input, it might already be in 24-hour format.)
  const convertTo24HourFormat = (time) => {
    // If the time string already looks like "14:00", just return it.
    if (time.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
      return `${time}:00`;
    }
    const [hours, minutes] = time.split(":");
    const [timeValue, period] = minutes.split(" ");
    let hours24 = parseInt(hours, 10);

    if (period === "PM" && hours24 !== 12) {
      hours24 += 12;
    } else if (period === "AM" && hours24 === 12) {
      hours24 = 0;
    }

    return `${hours24.toString().padStart(2, "0")}:${timeValue.padStart(2, "0")}:00`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate date (cannot book in the past)
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate < today) {
      setError("Please choose a valid date.");
      return;
    }
    setError("");

    // Convert time to 24-hour format if needed.
    const timeIn24HourFormat = convertTo24HourFormat(selectedTime);

    // Generate a unique booking ID
    const generatedBookingId = `BOOK-${Date.now()}`;

    // Prepare booking data (notice "table" is removed)
    const bookingData = {
      bookingId: generatedBookingId,
      name,
      selectedDate,
      selectedTime: timeIn24HourFormat,
      guestCount,
      phoneNumber,
    };

    try {
      // Update the endpoint to the customer bookings route
      const response = await fetch(`${API_BASE_URL}/api/customer-bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      const data = await response.json();

      if (response.ok) {
        alert(
          `Booking confirmed for ${guestCount} guests on ${selectedDate} at ${selectedTime}. Your booking ID is: ${generatedBookingId}`
        );
        setBookingId(generatedBookingId);
        // Optionally, clear the form fields:
        setName("");
        setSelectedDate("");
        setSelectedTime("");
        setGuestCount(1);
        setPhoneNumber("");
      } else {
        setError(data.error || "Booking failed");
      }
    } catch (err) {
      console.error("Error sending booking data:", err);
      setError("An error occurred while saving your booking.");
    }
  };

  return (
    <section id="booking-page">
      <h2>Reserve Your Table</h2>
      <p>Choose a date, time, and number of guests to reserve your table.</p>

      <p>
        Already booked?{" "}
        <Link to="/check-status">Click here to check your booking status</Link>
      </p>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="time">Select Time:</label>
          <input
            type="time"
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="guests">Number of Guests:</label>
          <input
            type="number"
            id="guests"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            min="1"
            max="10"
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <button type="submit">Book Now</button>
      </form>

      {bookingId && (
        <div>
          <p>Your Booking ID is: {bookingId}</p>
        </div>
      )}
    </section>
  );
}

export default Booking;





