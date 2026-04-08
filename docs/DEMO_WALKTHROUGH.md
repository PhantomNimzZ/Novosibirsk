# Novosibirsk Demo Walkthrough

**Estimated time: 5–7 minutes**

Follow this script to experience every feature of the PRASA Train Booking System. Each step has an expected result so you can verify the system is working correctly.

---

## 1. Landing Page (30 seconds)

**Open:** `http://localhost:5173`

- Observe the crossfading photo slideshow (Cape Town, Johannesburg, Durban) cycling every 5 seconds
- Note the PRASA nav bar with Train Schedules, FAQ, Contact Us, and Admin links
- See the two booking cards: Long-Distance and Commuter
- Scroll down to see the feature strip and footer

---

## 2. Long-Distance Booking (3 minutes)

**Click:** "Long-Distance" booking card (or "Book Now" button)

### Step 1 — Route Selection
- You'll see an interactive SVG map of South Africa
- **Click** Cape Town, then **click** Johannesburg
- The progress bar shows Step 1 of 3 complete

### Step 2 — Date & Time
- A 60-day horizontal calendar appears
- Today is highlighted with an orange "Today" badge
- **Click** any future date
- Five time slot cards appear (06:00, 09:30, 14:00, 18:30, 22:00)
- **Click** 09:30 (Morning)

### Step 3 — Train Selection
- Three train cards appear: Shosholoza Meyl (Economy R689), Premier Classe (Business R1,241), Blue Train (Luxury R2,413)
- Each shows amenities, seats remaining, departure/arrival times
- **Click** "Select Train" on Shosholoza Meyl

### 3D Animation
- A cinematic Three.js terrain flyover plays — Cape Town with Table Mountain visible
- Watch it for a few seconds or click "Skip Animation"

### Seat Selection & Booking
- The PRASA nav bar shows "← Back" button
- Train name "Shosholoza Meyl", route, time, price, and class are displayed
- A seat grid shows available (green), booked (red X), and selected (blue) seats
- **Click** any green seat (e.g., 5D)
- Fill in: Name, Email, ID Number
- **Click** "Proceed to Payment — R689"

### Payment
- A secure payment form appears with order summary
- Enter any card number (e.g., 4111 1111 1111 1111)
- Select expiry month and year, enter any CVV
- **Click** "Pay R689"
- Watch the processing animation (circular progress ring, ~3 seconds)

### Success
- Green checkmark with "Payment Successful!"
- Booking reference (PRASA-2026-XXXXX) displayed
- All journey details with "Paid" badge
- **Click** "Download Ticket (PDF)" to generate a PDF
- **Click** "Back to Home" to return

---

## 3. Commuter Booking (2 minutes)

**From the home page, click:** "Commuter" booking card

### City Selection
- Three city cards with photos: Cape Town, Johannesburg, Durban
- **Click** Durban

### Station Selection
- PRASA nav bar with "← Cities" and "Home" buttons
- **Select** "Phoenix" from the "From" dropdown
- **Select** "Durban" from the "To" dropdown
- Route validation shows: direct route on North Line, 2 stops, ~10 minutes, R20

### Route Map
- A Leaflet map appears showing the Phoenix → Durban route with station markers
- Cyan marker = origin, Green marker = destination, Blue line = route

### Quick Booking
- Enter your name
- **Select** "Mobile Payment"
- **Click** "Book Ticket"

### Payment (Mobile)
- Same card payment form as long-distance
- Enter any card details and pay R20
- Processing animation plays
- QR ticket appears with booking details

### Alternative: Cash at Station
- Go back and try again with "Cash at Station" selected
- Notice it skips the payment form and goes straight to the QR ticket

---

## 4. Information Pages (30 seconds)

**Click** each link in the nav bar:

- **FAQ** — 16 expandable accordion questions across 4 categories. Click a few to expand/collapse.
- **Train Schedules** — 6 route cards with timetables and fares. Click to expand.
- **Contact Us** — Head Office, Shosholoza Meyl Bookings, Customer Support, Emergency contacts.

Each page has the PRASA nav bar with "← Back to Home".

---

## 5. Admin Dashboard (2 minutes)

### Login
**Click** "Admin" in the nav bar (or navigate to `/admin-login`)

- Enter: `admin@prasa.com` / `admin123`
- **Click** Login

### Dashboard
- KPI cards: Total Bookings, Total Revenue, Bookings Today, Pending Payments
- Most Popular Route section
- Quick action cards at the bottom

### Manage Bookings
- **Click** "Manage Bookings" in the sidebar
- Note the search bar, status filter tabs (All, Active, Cancelled, Pending Payment)
- **Click** "Edit" on any booking to see the edit modal
- Note the seat availability dropdown and read-only train information
- Close the modal

### Manage Trains
- **Click** "Manage Trains" in the sidebar
- Note: 11,520 trains grouped into 26 routes
- Filter tabs: All, Long-Dist, Commuter
- **Click** any route card to expand — see services with time slot chips
- Try the search bar: type "Blue Train"

### Create Booking (Admin)
- **Click** "Long-Distance" in the sidebar
- Select a train from the dropdown
- Train details preview appears automatically
- Fill in passenger details and submit

### Create Commuter Booking (Admin)
- **Click** "Commuter" in the sidebar
- Select city, metro line, stations, and date
- Submit to create a commuter booking

---

## 6. Navigation Test (30 seconds)

Verify back buttons work from every page:

- Long-Distance → "← Back to Home" → Home
- Book Now → "← Back" → Previous page
- Commuter → "← Back to Home" → Home
- Commuter City → "← Cities" → Commuter, "Home" → Home
- FAQ / Schedules / Contact → "← Back to Home" → Home

---

## Checklist

| Feature | Status |
|---------|--------|
| Landing page slideshow | ☐ |
| SVG route map selection | ☐ |
| 60-day date picker | ☐ |
| Train results (3 classes) | ☐ |
| 3D route animation | ☐ |
| Seat selection (real-time) | ☐ |
| Card payment + processing | ☐ |
| PDF ticket download | ☐ |
| Commuter city selection | ☐ |
| Commuter route map | ☐ |
| Mobile payment flow | ☐ |
| Cash at station flow | ☐ |
| QR ticket | ☐ |
| FAQ accordion | ☐ |
| Admin login (JWT) | ☐ |
| Dashboard KPIs | ☐ |
| Manage Bookings (search/filter) | ☐ |
| Manage Trains (grouped) | ☐ |
| Create Booking (admin) | ☐ |
| Back navigation (all pages) | ☐ |
