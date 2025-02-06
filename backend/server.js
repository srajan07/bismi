// server.js
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "supersecretpassword";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "bismiDB",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
});

// Middleware to authenticate admin using JWT
const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authHeader received:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("No token provided");
    return res
      .status(403)
      .json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded token:", decoded);
    req.admin = decoded;
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ---------------------
// BOOKING & CONTACT ENDPOINTS
// ---------------------

// Check Booking Status
app.post("/api/check-status", async (req, res) => {
  const { bookingId } = req.body;
  if (!bookingId) {
    return res.status(400).json({ error: "Booking ID is required" });
  }
  const sql = "SELECT status FROM bookings WHERE booking_id = ?";
  try {
    const [result] = await db.promise().query(sql, [bookingId]);
    if (result.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({ status: result[0].status });
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create Booking (Protected - Admin Only)
app.post("/api/bookings", authenticateAdmin, async (req, res) => {
  const {
    bookingId,
    name = "",
    selectedDate,
    selectedTime,
    guestCount,
    phoneNumber,
  } = req.body;

  if (!bookingId || !selectedDate || !selectedTime || !guestCount || !phoneNumber) {
    return res.status(400).json({ error: "All required fields are required" });
  }

  const status = "Pending";
  const sql = `INSERT INTO bookings 
    (booking_id, name, selected_date, selected_time, guest_count, phone_number, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  try {
    await db.promise().query(sql, [
      bookingId,
      name,
      selectedDate,
      selectedTime,
      guestCount,
      phoneNumber,
      status,
    ]);
    res.status(201).json({
      message: "Booking saved successfully!",
      bookingId: bookingId,
    });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get All Bookings (Protected - Admin Only)
app.get("/api/bookings", authenticateAdmin, async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM bookings");
    console.log("Returning bookings:", results);
    res.json(results);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Update Booking Status (Protected - Admin Only)
app.put("/api/bookings/:booking_id/status", authenticateAdmin, async (req, res) => {
  const { booking_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  const sql = "UPDATE bookings SET status = ? WHERE booking_id = ?";
  try {
    const [results] = await db.promise().query(sql, [status, booking_id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Booking status updated successfully" });
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete Booking (Protected - Admin Only)
app.delete("/api/bookings/:booking_id", authenticateAdmin, async (req, res) => {
  const { booking_id } = req.params;
  const sql = "DELETE FROM bookings WHERE booking_id = ?";
  try {
    const [result] = await db.promise().query(sql, [booking_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Contact Form Submission (Public Endpoint)
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Name and Message are required" });
  }
  console.log("Received Form Data:", { name, email, phone, message });
  const sql = "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";
  try {
    const [result] = await db.promise().query(sql, [name, email, phone, message]);
    res.status(201).json({ message: "Message saved successfully!", id: result.insertId });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ---------------------
// ADMIN LOGIN ENDPOINT
// ---------------------

// Admin Login (Endpoint used by Login.jsx)
// Admin Login endpoint in server.js
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [result] = await db.promise().query("SELECT * FROM admin WHERE username = ?", [username]);
    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = result[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin.id }, SECRET_KEY, { expiresIn: "1h" });
    console.log("Admin logged in, token generated:", token);
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/customer-bookings", async (req, res) => {
  const {
    bookingId,
    name = "",
    selectedDate,
    selectedTime,
    guestCount,
    phoneNumber,
  } = req.body;

  if (!bookingId || !selectedDate || !selectedTime || !guestCount || !phoneNumber) {
    return res.status(400).json({ error: "All required fields are required" });
  }

  const status = "Pending";
  const sql = `INSERT INTO bookings 
    (booking_id, name, selected_date, selected_time, guest_count, phone_number, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  try {
    await db.promise().query(sql, [
      bookingId,
      name,
      selectedDate,
      selectedTime,
      guestCount,
      phoneNumber,
      status,
    ]);
    res.status(201).json({
      message: "Booking saved successfully!",
      bookingId: bookingId,
    });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
