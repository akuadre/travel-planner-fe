import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import Home from "./pages/Home.jsx";
import Destinations from "./pages/Destinations.jsx";
import DestinationDetail from "./pages/DestinationDetail.jsx";
import DestinationForm from "./pages/DestinationForm.jsx";
import Itineraries from "./pages/Itineraries.jsx";
import { GuestRoute, ProtectedRoute } from "./routes/AuthRoutes.jsx";

// ScrollToTop Component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public Routes (Guest Only) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes - TANPA ANIMATION DI ROOT */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/new" element={<DestinationForm />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route
              path="/destinations/:id/edit"
              element={<DestinationForm />}
            />
            <Route path="/itineraries" element={<Itineraries />} />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
