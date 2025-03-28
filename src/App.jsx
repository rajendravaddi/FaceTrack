import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import Dashboard from "./components/Dashboard"; // Updated import path
import AddCameras from "./components/AddCameras"; // Updated import path
import AddAuthMembers from "./components/AddAuthMembers"; // Updated import path

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
        
      </Routes>
    </Router>
  );
};

export default App;
