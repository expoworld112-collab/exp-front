// pages/api/signup.js
import connectDB from "../../helpers/dbConnect.js";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import corsAndProxy from "../../lib/apiProxy.js";

connectDB();

// Nodemailer transporter (server-side only)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  tls: { rejectUnauthorized: false },
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req, res) {
  // Handle CORS
  const allowedOrigins = ["https://efronts.vercel.app", "http://localhost:3000"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Use corsAndProxy if needed (optional, e.g., for calling backend APIs)
  // await corsAndProxy(req, res, "/api/target"); 
  // Uncomment and adjust if proxying requests

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password)
      return res.status(422).json({ error: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email is already registered" });

    // Create activation token
    const token = jwt.sign(
      { name, username, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    // Send activation email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Account Activation",
      html: `<p>Activate your account: <a href="${process.env.MAIN_URL}/auth/activate/${token}">Click here</a></p>`,
    });

    res.json({ message: `Activation email sent to ${email}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
