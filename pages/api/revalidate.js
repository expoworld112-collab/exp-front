export default async function handler(req, res) {
  // 1️⃣ CORS headers
  const allowedOrigins = ["https://efronts.vercel.app", "http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 2️⃣ Preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // ✅ respond to preflight
  }

  // 3️⃣ Only allow POST for signin
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 4️⃣ Handle signin request
  try {
    await signin(req, res); // your signin controller
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
