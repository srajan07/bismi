import React, { useState } from 'react';

function Status() {
  const [bookingId, setBookingId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleCheckStatus = async (event) => {
    event.preventDefault();

    // Clear any previous error or status
    setError('');
    setStatus('');

    try {
      const response = await fetch('http://localhost:5000/api/check-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      const data = await response.json();

      if (response.ok) {
        // If the status is returned successfully
        setStatus(data.status);
      } else {
        // Handle errors returned from the backend
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      console.error('Error checking booking status:', err);
      setError('Unable to check booking status');
    }
  };

  return (
    <section id="status-page">
      <h2>Check Your Booking Status</h2>
      <p>Enter your booking ID below to check your table reservation status.</p>
      
      <form onSubmit={handleCheckStatus}>
        <input
          type="text"
          placeholder="Enter Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          required
        />
        <button type="submit">Check Status</button>
      </form>

      {status && (
        <p>Your booking status is: {status}</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}
    </section>
  );
}

export default Status;
