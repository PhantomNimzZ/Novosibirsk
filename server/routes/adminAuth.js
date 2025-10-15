const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
const ADMIN_EMAIL = "admin@prasa.com";
const ADMIN_PASSWORD = "password123";

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Include role in payload for consistency
    const token = jwt.sign({ email, role: "admin" }, SECRET_KEY, { expiresIn: "2h" });
    return res.json({ token });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

module.exports = router;
