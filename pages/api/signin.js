// pages/api/signin.js
import { signinValidator, runValidation } from "../../validators/index.js";


// export default async function handler(req, res) {
//   // ✅ Allowed origins for CORS
//   const allowedOrigins = [
//     'https://efronts.vercel.app', // Production frontend
//     'http://localhost:3000'       // Local development
//   ];

//   const origin = req.headers.origin;

//   // ✅ Dynamically set Access-Control-Allow-Origin if origin is allowed
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//   }

//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');

//   // ✅ Handle preflight OPTIONS request
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   // ✅ Only allow POST for signin
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }

//   try {
//     // ✅ Parse JSON body
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     // ✅ Dummy authentication (replace with real DB lookup)
//     if (email === 'test@example.com' && password === '123456') {
//       return res.status(200).json({
//         message: 'Sign in successful',
//         token: 'fake-jwt-token',
//       });
//     }

//     return res.status(401).json({ error: 'Invalid credentials' });

//   } catch (err) {
//     console.error('Signin error:', err);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
// pages/api/signin.js

export default async function handler(req, res) {
  const allowedOrigins = [
    "https://efronts.vercel.app",
    "http://localhost:3000"
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (email === "test@example.com" && password === "123456") {
      return res.status(200).json({
        message: "Sign in successful",
        token: "fake-jwt-token"
      });
    }

    return res.status(401).json({ error: "Invalid credentials" });

  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// export async function signIn(email, password) {
//   try {
//     const response = await fetch("/api/signin", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//       credentials: "include",
//     });

//     const data = await response.json();

//     if (response.ok && data.token) {
//       console.log("Token:", data.token);
//       alert("Sign in successful!");
//     } else {
//       alert(data.error || "Login failed");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     alert("Network error. Please try again.");
//   }
// }

// Example usage

export async function signIn(email, password) {
  try {
    const response = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });

    const data = await response.json();

    if (response.ok && data.token) {
      alert("Sign in successful!");
    } else {
      alert(data.error || "Login failed");
    }
  } catch {
    alert("Network error. Please try again.");
  }
}


signIn('test@example.com', '123456');
