import React, { useRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useUsername } from "../context/UsernameContext";
import { useNavigate } from 'react-router-dom';  // Import useNavigate

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ListItemIcon
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

const get10MinBucket = (timestamp) => {
  const date = new Date(timestamp);
  const minutes = Math.floor(date.getMinutes() / 10) * 10;
  return `${date.getHours().toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};


const LiveMonitor = () => {
  const videoRef = useRef(null);
  const unknownFaceMapRef = useRef(new Map());
  const [recognizedFaces, setRecognizedFaces] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const [unknownFaces, setUnknownFaces] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detectedNames, setDetectedNames] = useState([]);

  const [isStreaming, setIsStreaming] = useState(false);
  const [frameCount, setFrameCount] = useState(1);
  const [intervalId, setIntervalId] = useState(null);
  const { username } = useUsername();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  //const { ipAddress, setIpAddress } = useIpAddress();
  const [showDetectedFacesBox, setShowDetectedFacesBox] = useState(false);

  //console.log("Global IP Address from Context:", ipAddress);



  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsStreaming(true);
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    if (intervalId) clearInterval(intervalId);
  };
  useEffect(() => {
    return () => {
      stopCamera(); // This will stop the camera when the component unmounts or you navigate away
    };
  }, []);



  const captureAndSend = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("user_id", username);
      formData.append("file", blob, "frame.jpg");

      try {
        const res = await axios.post("https://c7a5-34-80-210-207.ngrok-free.app/test-frame", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log(`sent frame ${frameCount}`);
        setFrameCount((prev) => prev + 1);

        const currentTime = Date.now();
        const results = res.data.results;
        const storedHistory = JSON.parse(localStorage.getItem("faceHistory")) || {};
        const history = {};

        // Convert back each bucket's array to a Set
        for (const bucket in storedHistory) {
          history[bucket] = new Set(storedHistory[bucket]);
        }


        const curentTime = Date.now();
        const recognized = [];

        results.forEach(resEntry => {
          const { name } = resEntry;
          const bucket = get10MinBucket(curentTime);

          if (!history[bucket]) {
            history[bucket] = new Set();
          }
          history[bucket].add(name);

          if (!name.startsWith("Unknown")) {
            recognized.push(name);
          }
        });

        if (recognized.length > 0) {
          setRecognizedFaces(recognized);
          setShowDrawer(true);
        }


        // Convert sets to arrays before saving
        const cleanedHistory = {};
        for (const bucket in history) {
          cleanedHistory[bucket] = Array.from(history[bucket]);
        }

        localStorage.setItem("faceHistory", JSON.stringify(cleanedHistory));

        const croppedFaces = res.data.cropped_faces || {};
        const original_imageb64 = res.data.image_base64;
        console.log(original_imageb64);
        res.data.results.forEach(resEntry => {
          const { name, bbox } = resEntry;
          console.log(name);
          const allNames = res.data.results.map(resEntry => resEntry.name);
          setDetectedNames(allNames.length > 0 ? allNames : ["None"]);
          if (name.startsWith("Unknown") && original_imageb64) {
            const now = Date.now();
            const lastSavedTime = unknownFaceMapRef.current.get(name) || 0;

            if (now - lastSavedTime >= 10 * 60 * 1000) {
              const imageBase64 = croppedFaces[name];

              if (!imageBase64) {
                console.warn("No cropped face for", name);
                return;
              }

              const newEntry = {
                name,
                bbox,
                image: `data:image/jpeg;base64,${imageBase64}`,
                original_image: `data:image/jpeg;base64,${original_imageb64}`,
                timestamp: now,
              };

              // Safely update state and ref
              setUnknownFaces(prev => {
                const updated = [...prev, newEntry];
                localStorage.setItem("unknownFaces", JSON.stringify(updated));
                return updated;
              });

              unknownFaceMapRef.current.set(name, now);
            }
          }
        });

      } catch (error) {
        console.error("Error sending frame:", error);
      }
    }, "image/jpeg");
  };

  useEffect(() => {
    if (isStreaming) {
      const id = setInterval(captureAndSend, 1000);
      setIntervalId(id);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStreaming]);

  useEffect(() => {
    const savedFaces = JSON.parse(localStorage.getItem("unknownFaces"));
    if (savedFaces && Array.isArray(savedFaces)) {
      setUnknownFaces(savedFaces);
      const map = new Map();
      savedFaces.forEach(f => map.set(f.name, f.timestamp));
      unknownFaceMapRef.current = map;
    }
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", minHeight: "100vh", background: "linear-gradient(to right, rgba(15,23,42,0.9), rgba(30,58,138,0.85))" }}>
      <Drawer open={sidebarOpen} onClose={toggleSidebar} sx={{ width: 240, flexShrink: 0 }}>
        <Toolbar />
        <Box sx={{ textAlign: "center", p: 2, fontFamily: "monospace", fontWeight: "bold", fontSize: "1.5rem" }}>
          FaceTrack
        </Box>
        <Box sx={{ overflow: "auto" }}>
          <List>
            {[
              ["Dashboard Overview", "/dashboard"],
              ["Add Camera Details", "/add-cameras"],
              ["View Stored Details", "/view-details"],
              ["Add Authorized Members", "/add-authorized"],
              ["View Authorized Members", "/authorized-members"],
              ["History", "/history"],
              ["Alerts", "/alerts"],
              ["Live Camera Monitor", "/live-monitor"],
              ["Logout", "/login"],
            ].map(([text, path]) => (
              <ListItem button component={Link} to={path} key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static" sx={{ backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleSidebar} sx={{ mr: 2 }}>
              <MenuIcon />


            </IconButton>

            <Typography
              variant="h4"
              sx={{
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: "bold",
                letterSpacing: 2,
                color: "#fff",
              }}
            >
              FaceTrack
            </Typography>
            <Button
              onClick={() => setShowDetectedFacesBox(prev => !prev)}
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "#94a3b8",
                ml: 2,
                fontWeight: "bold",
                textTransform: "none",
                '&:hover': {
                  borderColor: "#cbd5e1",
                  backgroundColor: "rgba(255,255,255,0.1)"
                }
              }}
            >
              {showDetectedFacesBox ? "Hide Detected Faces" : "Show Detected Faces"}
            </Button>
          </Toolbar>
        </AppBar>

        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            maxWidth: "800px",
            width: "100%",
            textAlign: "center",
            margin: "auto",
            marginTop: "2rem",
          }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#fff" }}>
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
          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
  <button
    onClick={startCamera}
    style={{
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
    onMouseEnter={(e) => (e.target.style.backgroundColor = "#15803d")}
    onMouseLeave={(e) => (e.target.style.backgroundColor = "#16a34a")}
  >
    Start Camera & Stream Frames
  </button>

  <button
    onClick={stopCamera}
    style={{
      padding: "1rem 2rem",
      fontSize: "1.1rem",
      fontWeight: "bold",
      backgroundColor: "#dc2626",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(220,38,38,0.4)",
      transition: "background-color 0.3s ease",
    }}
    onMouseEnter={(e) => (e.target.style.backgroundColor = "#b91c1c")}
    onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc2626")}
  >
    Stop Camera
  </button>
</div>

        </div>
        <Drawer
          anchor="right"
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          PaperProps={{
            sx: { width: 300, backgroundColor: "#1e293b", color: "#fff", padding: 2 },
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
            Recognized Faces
          </Typography>
          <List>
            {recognizedFaces.map((face, idx) => (
              <ListItem key={idx} sx={{ backgroundColor: "#334155", mb: 1, borderRadius: "8px" }}>
                <ListItemText primary={face} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        {showDetectedFacesBox && (
          <Box
            sx={{
              width: 300,
              backgroundColor: "#0f172a",
              color: "#fff",
              padding: 2,
              position: "fixed",
              right: 0,
              top: 100,
              height: "100vh",
              borderLeft: "2px solid #334155",
              zIndex: 1200
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
              Detected Faces
            </Typography>
            <List>
              {detectedNames.length > 0 ? (
                detectedNames.map((name, idx) => (
                  <ListItem key={idx} sx={{ backgroundColor: "#334155", mb: 1, borderRadius: "8px" }}>
                    <ListItemText primary={name} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  No faces detected
                </Typography>
              )}
            </List>
          </Box>
        )}



      </Box>

    </Box>
  );
};

export default LiveMonitor;
