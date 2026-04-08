// server/routes/admin/adminAuth.js
// Note: dotenv.config() is called in server.js before this module is imported.
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("❌ JWT_SECRET environment variable is not set. Server cannot start safely.");
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD_HASH not set in environment");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  if (email !== adminEmail) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const passwordValid = await bcrypt.compare(password, adminPasswordHash);

  if (!passwordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email, role: "admin" },
    SECRET_KEY,
    { expiresIn: "2h" }
  );

  return res.json({ token });
});

export default router;
