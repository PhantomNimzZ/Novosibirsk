import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import StartPage from './pages/start/StartPage.jsx';
import RouteType from "./pages/bookings/RouteType.jsx";
import LongDistance from './pages/bookings/long-distance/LongDistance.jsx';
import Commuter from './pages/bookings/commuter/Commuter.jsx';
import BookNow from './pages/bookings/BookNow.jsx';
import CommuterCity from './pages/bookings/commuter/CommuterCity.jsx';
import ProtectedRoute from "./components/ProtectedRoute.jsx"; 

import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin.jsx";

// Updated paths for admin pages
import Dashboard from "./pages/admin/Dashboard.jsx";
import ManageBookings from "./pages/admin/ManageBookings.jsx";
import CreateBooking from "./pages/admin/CreateBooking.jsx";
import ManageTrains from "./pages/admin/ManageTrains.jsx";

// Create root
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<StartPage />} />
        <Route path="/select" element={<RouteType />} />
        <Route path="/long-distance" element={<LongDistance />} />
        <Route path="/commuter" element={<Commuter />} />
        <Route path="/book" element={<BookNow />} />
        <Route path="/commuter/:cityId" element={<CommuterCity />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Routes (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} /> {/* Admin dashboard */}
            <Route path="create-booking" element={<CreateBooking />} /> {/* New Booking */}
            <Route path="manage-bookings" element={<ManageBookings />} /> {/* Manage Bookings */}
            <Route path="manage-trains" element={<ManageTrains />} /> {/* Manage Trains */}
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
