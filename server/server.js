const express = require('express');
const cors = require('cors'); 
const { PrismaClient } = require('@prisma/client');
const app = express();
const PORT = 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Sample API route for train search
app.get('/api/search', (req, res) => {
  const { from, to, date } = req.query;

  const results = [
    {
      id: 1,
      train: 'Blue Train',
      from,
      to,
      date,
      time: '08:00',
      price: 'R250',
    },
    {
      id: 2,
      train: 'Shosholoza Express',
      from,
      to,
      date,
      time: '14:00',
      price: 'R200',
    },
  ];

  res.json(results);
});


app.post('/api/book', async (req, res) => {
  console.log("📥 Booking request received:", req.body);

  try {
    const {
      train,
      from,
      to,
      date,
      time,
      price,
      name,
      email,
      idNumber,
      payment
    } = req.body;

    const booking = await prisma.booking.create({
      data: {
        train,
        from,
        to,
        date,
        time,
        price,
        name,
        email,
        idNumber,
        payment
      }
    });

    res.status(201).json({ message: "Booking saved", booking });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ message: "Failed to save booking" });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});


app.listen(PORT, () => {
  console.log(`🚆 Server running on http://localhost:${PORT}`);
});


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
    position: {
      lat: currentStop.lat,
      lng: currentStop.lng,
      station: currentStop.station,
    },
    updatedAt: new Date().toISOString(),
    status: "On Time",
  });
});

