import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import Dashboard from "./components/Dashboard"; // Updated import path
import AddCameras from "./components/AddCameras"; // Updated import path
import AddAuthMembers from "./components/AddAuthMembers"; 
import ViewStoredDetails from "./components/ViewStoredDetails.jsx";// Updated import path
import ViewAuthorizedFaces from "./components/ViewAuthorizedFaces.jsx";
import LiveMonitor from "./components/LiveMonitor";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-cameras" element={<AddCameras />} />
        <Route path="/add-authorized" element={<AddAuthMembers />} />
        <Route path="/view-details" element={<ViewStoredDetails />} />
        <Route path="/authorized-members" element={<ViewAuthorizedFaces/>} />
        <Route path="/live-monitor" element={<LiveMonitor />} />

        
      </Routes>
    </Router>
  );
};

export default App;
