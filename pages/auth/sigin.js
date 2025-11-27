// pages/api/login.js

import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import  connectDB from "../../utils/db.js" ;
// Connect to MongoDB
connectDB();

export default async function handler(req, res) {
  // --- CORS ---
  const allowedOrigins = ["https://efronts.vercel.app", "http://localhost:3000"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // --- Preflight ---
  if (req.method === "OPTIONS") return res.status(200).end();

  // Only POST allowed
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email not found" });

    // Check password
    if (!user.authenticate(password)) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Generate JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; SameSite=None; Secure`
    );

    // Return user info
    const { _id, username, name, role } = user;
    res.status(200).json({ token, user: { _id, username, name, email, role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
