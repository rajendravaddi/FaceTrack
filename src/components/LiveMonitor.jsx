import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useUsername } from "../context/UsernameContext";

const LiveMonitor = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [frameCount, setFrameCount] = useState(1);
  const [intervalId, setIntervalId] = useState(null);
  const { username } = useUsername();

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setIsStreaming(true);
  };

  useEffect(() => {
    if (isStreaming) {
      const id = setInterval(() => {
        captureAndSend();
      }, 1000);
      setIntervalId(id);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStreaming]);

  const captureAndSend = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("user_id",username);
      formData.append("file", blob, "frame.jpg");

      try {
        const res = await axios.post("https://2cb8-34-27-75-164.ngrok-free.app/test-frame", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(`sent frame ${frameCount}`);
        setFrameCount(prev => prev + 1);

        const timestamp = new Date().toLocaleString();
        res.data.results.forEach((result) => {
          console.log(`[${timestamp}] name: ${result.name}`);
        });

      } catch (error) {
        console.error("Error sending frame:", error);
      }
    }, "image/jpeg");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, rgba(15,23,42,0.9), rgba(30,58,138,0.85))",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          maxWidth: "800px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
          🎥 Live Camera Monitor
        </h2>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            borderRadius: "12px",
            border: "2px solid #334155",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            width: "100%",
            maxWidth: "640px",
            height: "auto",
          }}
        />
        <br />
        <button
          onClick={startCamera}
          style={{
            marginTop: "1.5rem",
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            fontWeight: "bold",
            backgroundColor: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(22,163,74,0.4)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={e => e.target.style.backgroundColor = "#15803d"}
          onMouseLeave={e => e.target.style.backgroundColor = "#16a34a"}
        >
          Start Camera & Stream Frames
        </button>
      </div>
    </div>
  );
};

export default LiveMonitor;
