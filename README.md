PRASA Booking System

A train booking system built with React (frontend), Node.js + Express (backend), and Prisma + SQLite/PostgreSQL (database).
This system allows admins to manage bookings efficiently with full CRUD operations.

Features
Booking Management (Admin)

- Create Booking

Add new bookings with passenger information, train selection, seat, date, time, and price.

Automatic train number population based on selected train.

- Read Bookings

View all bookings in a clean, sortable table.

Search bookings by passenger, train, or date.

- Update Booking

Edit any booking details via a modal form.

Real-time update of train and passenger information.

- Delete Booking

Remove unwanted bookings with a single click.

API Endpoints
Endpoint	Method	Description
/api/bookings	GET	Get all bookings
/api/bookings	POST	Create a new booking
/api/bookings/:id	PUT	Update an existing booking
/api/bookings/:id	DELETE	Delete a booking
/api/trains	GET	Get all trains
