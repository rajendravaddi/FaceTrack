import React from "react";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="hero-container">
      <h1>Welcome to FaceTrack</h1>
      <p>
        Monitor live camera streams, detect faces in real-time, and manage authorized members — all in one secure dashboard.
      </p>
      <button onClick={() => navigate("/live-monitor")}>Get Started</button>
    </div>
  );
}

export default HeroSection;
