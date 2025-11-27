import { signout } from "../../controllers/auth.js";
import corsAndProxy from "../../lib/apiProxy";

// export default function handler(req, res) {
//   const allowedOrigins = ["https://efronts.vercel.app", "http://localhost:3000"];
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }

//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") return res.status(200).end();
//   if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

//   try {
//     signout(req, res);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }
// pages/api/signout.js
export default function handler(req, res) {
  const allowedOrigins = ["https://efronts.vercel.app", "http://localhost:3000"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  res.setHeader(
    "Set-Cookie",
    `token=; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=0`
  );
  res.json({ message: "Signout successful" });
}
export default function handler(req, res) {
  return corsAndProxy(req, res, "/api/signout");
}
