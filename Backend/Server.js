const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" })); // later you can restrict it
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306), // ✅ add this
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// test route
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows[0].ok });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ✅ GET all students
app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT roll_no, name, major_id FROM students ORDER BY roll_no"
    );
    res.json({ ok: true, students: rows });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ✅ POST add student
app.post("/api/students", async (req, res) => {
  const { roll_no, name, major_id } = req.body;

  if (!roll_no || !name || !major_id) {
    return res.status(400).json({ ok: false, message: "Missing fields." });
  }

  try {
    await pool.query(
      "INSERT INTO students (roll_no, name, major_id) VALUES (?, ?, ?)",
      [roll_no, name, major_id]
    );
    res.json({ ok: true });
  } catch (err) {
    // duplicate roll number
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ ok: false, message: "Roll number already exists." });
    }
    res.status(500).json({ ok: false, message: err.message });
  }
});
