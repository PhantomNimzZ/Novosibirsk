// server/routes/adminAuth.js
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
const ADMIN_EMAIL = "admin@prasa.com";
const ADMIN_PASSWORD = "password123";

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, role: "admin" },
      SECRET_KEY,
      { expiresIn: "2h" }
    );
    return res.json({ token });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

export default router;
