# PRASA Train Booking System (Project Novosibirsk)

A full-stack web application for the Passenger Rail Agency of South Africa (PRASA), providing online booking for long-distance (Shosholoza Meyl) and commuter (Metrorail) train services.

Built with React, Express, Prisma, and SQLite. Features cinematic 3D route animations, interactive SVG railway maps, a simulated payment system, and a full admin dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Seeding](#database-seeding)
- [Admin Access](#admin-access)
- [API Endpoints](#api-endpoints)
- [Documentation](#documentation)

---

## Features

### Public Booking

- **Long-Distance Booking Flow** — Interactive SVG map of South Africa for route selection, 60-day date picker with time slots, train class selection (Economy/Business/Luxury), seat selector with real-time availability, and a simulated card payment system with processing animation.
- **Cinematic 3D Route Animation** — Three.js powered terrain flyover between cities using GLB models, triggered after train selection. Shows intermediate stops, distance, and estimated arrival.
- **Commuter / Metrorail Booking** — Quick booking for Cape Town, Johannesburg, and Durban metro networks. Supports direct routes and transfer routes with line detection. Options for mobile payment or cash at station. Generates a QR code ticket on completion.
- **Payment System** — Simulated card payment with card number formatting, MM/YY expiry selects, CVV entry, and a processing animation that updates the booking status from Pending to Paid via the API.

### Admin Dashboard

- **Dashboard Overview** — KPI cards showing total bookings, revenue, bookings today, and pending payments. Most popular route display with quick action links.
- **Manage Trains** — Trains grouped by route in expandable cards. Filter tabs for All, Long-Distance, and Commuter. Search across train names, routes, and classes. Time slot chips per service. Edit individual departures.
- **Manage Bookings** — Full CRUD with search, status filters (Active/Cancelled/Pending Payment), inline editing with seat availability checks, and soft-delete (cancel with automatic refund status).
- **Create Booking** — Manual booking creation for both long-distance and commuter services. Train selection with live details preview.

### Information Pages

- **Train Schedules** — Six expandable route cards with timetables and fare information.
- **FAQ** — 16 questions across four categories (Booking & Tickets, Train Services, Commuter/Metrorail, Safety & Policies).
- **Contact Us** — Head Office, Shosholoza Meyl Bookings, Customer Support, and Emergency contact details.

### Technical Highlights

- JWT authentication with bcrypt password hashing
- Transactional seat conflict prevention (no double-booking)
- Soft-delete on bookings with automatic refund status
- Email validation, enum enforcement, and field whitelisting on all API endpoints
- PRASA brand design system with consistent tokens (colours, typography, spacing)
- Responsive design across all pages
- PDF ticket generation with jsPDF

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| 3D Animation | Three.js (GLB terrain models) |
| Maps | Leaflet + OpenStreetMap |
| Backend | Express.js, Node.js |
| Database | SQLite (via Prisma ORM) |
| Authentication | JWT + bcrypt |
| PDF Generation | jsPDF + jspdf-autotable |

---

## Project Structure

```
Novosibirsk/
├── client/
│   ├── public/
│   │   ├── images/          # City photos (.avif)
│   │   └── models/          # 3D terrain GLB files
│   ├── src/
│   │   ├── api/             # API config
│   │   ├── components/
│   │   │   ├── admin/       # Admin UI components
│   │   │   ├── booking/     # Booking flow components
│   │   │   └── maps/        # Map components
│   │   ├── constants/       # Metro lines, routes, stations
│   │   ├── pages/
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── bookings/    # Booking pages
│   │   │   ├── info/        # FAQ, Contact, Schedules
│   │   │   └── start/       # Landing page
│   │   ├── styles/          # Design tokens
│   │   └── utils/           # PDF, pricing, route utilities
│   └── package.json
├── server/
│   ├── controllers/
│   │   └── admin/           # Stats, export controllers
│   ├── middleware/           # JWT auth middleware
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── seed.js          # Long-distance seed
│   │   └── seedCommuterV2.js # Commuter seed
│   ├── routes/
│   │   └── admin/           # Auth, bookings, trains, stats, export
│   ├── server.js
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/prasa-booking-system.git
cd prasa-booking-system/Novosibirsk

# Install server dependencies
cd server
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH

# Generate Prisma client and run migrations
npx prisma generate
npx prisma db push

# Seed the database (60 days of train data)
node prisma/seed.js
node prisma/seedCommuterV2.js

# Start the server
npm start
# Server runs on http://localhost:3001

# In a new terminal, install and start the client
cd ../client
npm install
npm run dev
# Client runs on http://localhost:5173
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
JWT_SECRET=your-strong-secret-key-here
ADMIN_EMAIL=admin@prasa.com
ADMIN_PASSWORD_HASH=$2b$10$... (bcrypt hash of your admin password)
PORT=3001
```

Generate a password hash:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(h => console.log(h));"
```

---

## Database Seeding

The application uses two seed scripts to populate train schedules:

```bash
node prisma/seed.js           # Long-distance trains (Shosholoza Meyl, Blue Train, Premier Classe)
node prisma/seedCommuterV2.js  # Commuter/Metrorail trains (Cape Town, JHB, Durban)
```

Both scripts seed 60 days of data from today. Re-run them when the data expires.

**Note:** `seed.js` deletes all existing bookings and trains before seeding. `seedCommuterV2.js` only affects Metro Rail trains and their associated bookings.

---

## Admin Access

Navigate to `/admin-login` or click "Admin" in the navigation bar.

**Default credentials:**
- Email: `admin@prasa.com`
- Password: `admin123`

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trains` | List all trains |
| GET | `/api/trains/:id` | Get single train |
| GET | `/api/search?from=X&to=Y&date=YYYY-MM-DD` | Search trains |
| GET | `/api/search/routes` | Get available routes |
| GET | `/api/search/dates?from=X&to=Y` | Get available dates |
| GET | `/api/trains/:id/seats?date=YYYY-MM-DD` | Get booked seats |
| POST | `/api/bookings` | Create booking |

### Admin (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/login` | Admin login |
| GET | `/api/bookings` | List all bookings |
| PUT | `/api/bookings/:id` | Update booking |
| DELETE | `/api/bookings/:id` | Cancel booking (soft-delete) |
| POST | `/api/trains` | Create train |
| PUT | `/api/trains/:id` | Update train |
| DELETE | `/api/trains/:id` | Delete train |
| GET | `/api/admin/stats/overview` | Dashboard statistics |
| GET | `/api/admin/export/bookings/csv` | Export bookings as CSV |

---

## Documentation

For detailed technical documentation including system architecture, UML diagrams, database schema, and future roadmap, see [`TECHNICAL_DOCUMENTATION.pdf`](./docs/TECHNICAL_DOCUMENTATION.pdf).

---

## Licence

This project is a demonstration application and is not affiliated with or endorsed by the Passenger Rail Agency of South Africa (PRASA). For official PRASA information, visit [www.prasa.com](https://www.prasa.com).
