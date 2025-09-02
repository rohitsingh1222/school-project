import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import serverless from "serverless-http";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection (PlanetScale)
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,     // e.g. aws.connect.psdb.cloud
  user: process.env.DATABASE_USERNAME, // from PlanetScale
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { rejectUnauthorized: true },
});

// File upload (using memory storage for serverless)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Test route
app.get("/api", (req, res) => {
  res.send("✅ Backend is running!");
});

// Add school
app.post("/api/schools", upload.single("image"), async (req, res) => {
  try {
    const { name, address, city, state, contact, email_id } = req.body;

    if (!name || !address || !city || !state || !contact || !email_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save image buffer as base64 (you can later connect Cloudinary if needed)
    const image = req.file ? req.file.buffer.toString("base64") : null;

    const query = `
      INSERT INTO schools (name, address, city, state, contact, email_id, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, address, city, state, contact, email_id, image];

    const conn = await pool.getConnection();
    await conn.query(query, values);
    conn.release();

    res.status(201).json({ message: "School added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get schools
app.get("/api/schools", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM schools");
    conn.release();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Local development (runs only when not in Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export for Vercel
export const handler = serverless(app);
