// api/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create MySQL pool (recommended for serverless)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: true }, // PlanetScale requires SSL
});

// ✅ Routes
app.get("/api/schools", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM schools");
    res.json(rows);
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/schools", async (req, res) => {
  try {
    const { name, address, city, state, contact, email_id } = req.body;

    if (!name || !address || !city) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await pool.query(
      "INSERT INTO schools (name, address, city, state, contact, email_id) VALUES (?, ?, ?, ?, ?, ?)",
      [name, address, city, state, contact, email_id]
    );

    res.json({ message: "School added successfully" });
  } catch (err) {
    console.error("Insert Error:", err.message);
    res.status(500).json({ error: "Database insert error" });
  }
});

// ❌ DO NOT use app.listen on Vercel
export default serverless(app);
