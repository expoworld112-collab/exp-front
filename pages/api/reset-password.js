// pages/api/reset-password.js

import { resetPassword } from "../../../Backend-Coding4u-main/controllers/auth.js";

export default async function handler(req, res) {
  // CORS
  const allowedOrigins = ["https://efronts.vercel.app", "http://localhost:3000"];
  if (allowedOrigins.includes(req.headers.origin)) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Preflight
  if (req.method === "OPTIONS") return res.status(200).end();

  // Only PUT allowed
  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });

  try {
    await resetPassword(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
