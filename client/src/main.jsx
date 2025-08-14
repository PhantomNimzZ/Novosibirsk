import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import StartPage from './pages/StartPage.jsx';
import RouteType from "./pages/RouteType.jsx";
import LongDistance from './pages/LongDistance.jsx';
import Commuter from './pages/Commuter.jsx';
import BookNow from './pages/BookNow.jsx';
import CommuterCity from './pages/CommuterCity.jsx';
import Admin from "./pages/Admin.jsx"; // ✅ updated
import Bookings from "./pages/Bookings.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; 
import AdminLogin from "./pages/AdminLogin.jsx"; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<StartPage />} />
        <Route path="/select" element={<RouteType />} />
        <Route path="/long-distance" element={<LongDistance />} />
        <Route path="/commuter" element={<Commuter />} />
        <Route path="/book" element={<BookNow />} />
        <Route path="/booking" element={<App />} />
        <Route path="/commuter/:cityId" element={<CommuterCity />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
