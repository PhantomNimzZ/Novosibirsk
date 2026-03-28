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
import TrainSchedules from './pages/info/TrainSchedules.jsx';
import ContactUs from './pages/info/ContactUs.jsx';
import ProtectedRoute from "./components/ProtectedRoute.jsx"; 

import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import ManageBookings from "./pages/admin/ManageBookings.jsx";
import CreateBooking from "./pages/admin/CreateBooking.jsx";
import CreateCommuterBooking from "./pages/admin/CreateCommuterBooking.jsx";
import ManageTrains from "./pages/admin/ManageTrains.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // StrictMode disabled to fix 3D animation duplicate canvas issue
  <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<StartPage />} />
      <Route path="/select" element={<RouteType />} />
      <Route path="/long-distance" element={<LongDistance />} />
      <Route path="/commuter" element={<Commuter />} />
      <Route path="/book" element={<BookNow />} />
      <Route path="/commuter/:cityId" element={<CommuterCity />} />
      <Route path="/schedules" element={<TrainSchedules />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Admin Routes (Protected) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="create-booking" element={<CreateBooking />} />
          <Route path="create-commuter-booking" element={<CreateCommuterBooking />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="manage-trains" element={<ManageTrains />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<StartPage />} />
    </Routes>
  </BrowserRouter>
);
