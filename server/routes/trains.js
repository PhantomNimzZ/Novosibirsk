// server/routes/trains.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const trains = await prisma.train.findMany();
    res.json(trains); // ✅ Must use res.json, not res.send
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching trains");
  }
});

module.exports = router;
