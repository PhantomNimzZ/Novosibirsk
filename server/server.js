const express = require('express');
const cors = require('cors'); 
const { PrismaClient } = require('@prisma/client');
const app = express();
const PORT = 3001;
const prisma = new PrismaClient();

const bookingRoutes = require("./routes/bookings");

app.use(cors());
app.use(express.json());

// Mount all booking CRUD under /api/bookings
app.use("/api/bookings", bookingRoutes);

// Sample API route for train search
app.get('/api/search', (req, res) => {
  const { from, to, date } = req.query;

  const results = [
    { id: 1, trainNumber: 'Blue Train', departure: from, destination: to, date, time: '08:00', price: 'R250' },
    { id: 2, trainNumber: 'Shosholoza Express', departure: from, destination: to, date, time: '14:00', price: 'R200' },
  ];

  res.json(results);
});

// Live tracking API (unchanged)
const trainRoutes = {
  "commuter-line---durban": [
    { station: "Durban", lat: -29.8587, lng: 31.0218 },
    { station: "Umlazi", lat: -29.9641, lng: 30.8797 },
    { station: "Pinetown", lat: -29.8186, lng: 30.8657 },
    { station: "KwaMashu", lat: -29.7462, lng: 30.9928 },
  ],
  "blue-train": [
    { station: "Cape Town", lat: -33.918861, lng: 18.4233 },
    { station: "Kimberley", lat: -28.7383, lng: 24.7637 },
    { station: "Pretoria", lat: -25.7479, lng: 28.2293 },
  ],
};

app.get('/api/live-location/:trainId', (req, res) => {
  const { trainId } = req.params;
  console.log("📍 Live tracking request for train:", trainId);

  const route = trainRoutes[trainId] || [];
  if (route.length === 0) {
    return res.status(404).json({ message: "Train route not found" });
  }

  const index = Math.floor(Date.now() / 10000) % route.length;
  const currentStop = route[index];

  res.json({
    trainId,
    location: currentStop.station,
    position: { lat: currentStop.lat, lng: currentStop.lng, station: currentStop.station },
    updatedAt: new Date().toISOString(),
    status: "On Time",
  });
});

app.listen(PORT, () => {
  console.log(`🚆 Server running on http://localhost:${PORT}`);
});
