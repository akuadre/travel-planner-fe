import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./utils/auth.jsx";

import { NotificationProvider } from "./components/Notification";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
    {/* <Router basename="/travel"> */}
      <AuthProvider>
        {/* 🔥 WRAP DENGAN NOTIFICATION */}
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
