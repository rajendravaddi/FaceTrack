import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import Dashboard from "./components/Dashboard";
import AddCameras from "./components/AddCameras";
import AddAuthMembers from "./components/AddAuthMembers";
import ViewStoredDetails from "./components/ViewStoredDetails.jsx";
import ViewAuthorizedFaces from "./components/ViewAuthorizedFaces.jsx";
import LiveMonitor from "./components/LiveMonitor";
import Alerts from "./components/Alerts.jsx";
import History from "./components/History.jsx";

import { UsernameProvider } from "./context/UsernameContext"; // ✅ Username context
import { IpAddressProvider } from "./context/IpAddressContext"; // ✅ IP address context

const App = () => {
  return (
    <UsernameProvider>
      <IpAddressProvider> {/* ✅ Wrap the entire app with IP address context */}
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-cameras" element={<AddCameras />} />
            <Route path="/add-authorized" element={<AddAuthMembers />} />
            <Route path="/view-details" element={<ViewStoredDetails />} />
            <Route path="/authorized-members" element={<ViewAuthorizedFaces />} />
            <Route path="/live-monitor" element={<LiveMonitor />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Router>
      </IpAddressProvider>
    </UsernameProvider>
  );
};

export default App;
