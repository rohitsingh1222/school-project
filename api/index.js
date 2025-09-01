import express from "express";
import serverless from "serverless-http";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ---- Cloudinary config ----
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---- Multer setup (store in memory) ----
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---- MySQL connection pool (PlanetScale) ----
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: true },
});

// ---- POST: add school with image upload ----
app.post("/api/schools", upload.single("image"), async (req, res) => {
  try {
    const { name, address, city, state, contact, email_id } = req.body;
    if (!name || !address || !city || !state || !contact || !email_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "schools" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const sql =
      "INSERT INTO schools (name,address,city,state,contact,image,email_id) VALUES (?,?,?,?,?,?,?)";
    const [result] = await pool.query(sql, [
      name,
      address,
      city,
      state,
      contact,
      imageUrl,
      email_id,
    ]);

    res.json({ ok: true, id: result.insertId, image: imageUrl });
  } catch (e) {
    console.error("Insert error:", e);
    res.status(500).json({ error: e.message });
  }
});

// ---- GET: fetch schools ----
app.get("/api/schools", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, address, city, image FROM schools ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Select error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default serverless(app);
