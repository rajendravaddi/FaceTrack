import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  TextField,
  Paper
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useUsername } from "../context/UsernameContext";

const AddCameras = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const { username } = useUsername();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cameraName, setCameraName] = useState("");
  const [ipAddresses, setIpAddresses] = useState([""]);
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("add");
  const [cameraId, setCameraId] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Parse mode from URL
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const modeParam = params.get("mode");
    if (modeParam === "edit") {
      setMode("edit");
    }
  }, [locationHook]);

  // Fetch existing camera if in edit mode
  useEffect(() => {
    const fetchCamera = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cameras/${username}`);
        const data = await response.json();
        if (data && data.length > 0) {
          const cam = data[0];
          setCameraName(cam.cameraName || "");
          setIpAddresses(cam.ipAddresses || [""]);
          setLocation(cam.location || "");
          setCameraId(cam._id);
        }
      } catch (err) {
        console.error("Error loading camera data:", err);
      }
    };

    if (mode === "edit" && username) {
      fetchCamera();
    }
  }, [mode, username]);

  const handleAddIpField = () => {
    if (ipAddresses.length < 4) {
      setIpAddresses([...ipAddresses, ""]);
    }
  };

  const handleIpChange = (index, value) => {
    const updatedIps = [...ipAddresses];
    updatedIps[index] = value;
    setIpAddresses(updatedIps);
  };

  const handleSubmit = async () => {
    if (!cameraName || ipAddresses.some(ip => ip.trim() === "")) {
      alert("Please fill out all required fields.");
      return;
    }

    const payload = {
      username,
      cameraName,
      ipAddresses,
      location,
    };

    try {
      let response;
      if (mode === "edit" && cameraId) {
        response = await fetch(`http://localhost:5000/api/cameras/update/${cameraId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("http://localhost:5000/api/cameras/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        alert(`Camera ${mode === "edit" ? "updated" : "added"} successfully!`);
        navigate("/view-details");
      } else {
        const errorData = await response.json();
        alert("Failed to save camera: " + (errorData.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, rgba(15,23,42,0.9), rgba(30,58,138,0.85))",
        display: "flex",
        flexDirection: "row",
      }}
    >
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
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#fff" }}>
              {mode === "edit" ? "Update Camera Details" : "Add Camera Details"}
            </Typography>

            <TextField
              fullWidth
              label="Camera Name"
              margin="normal"
              required
              value={cameraName}
              onChange={(e) => setCameraName(e.target.value)}
              variant="filled"
              sx={{
                input: { color: "#fff" },
                label: { color: "#ccc" },
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 1,
              }}
            />

            {ipAddresses.map((ip, index) => (
              <TextField
                key={index}
                fullWidth
                label={`IP Address ${index + 1}`}
                margin="normal"
                required
                value={ip}
                onChange={(e) => handleIpChange(index, e.target.value)}
                variant="filled"
                sx={{
                  input: { color: "#fff" },
                  label: { color: "#ccc" },
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 1,
                }}
              />
            ))}

            {ipAddresses.length < 4 && (
              <Button
                variant="outlined"
                onClick={handleAddIpField}
                sx={{
                  mt: 2,
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderColor: "#ccc",
                  },
                }}
              >
                + Add IP Address
              </Button>
            )}

            <TextField
              fullWidth
              label="Location (Optional)"
              margin="normal"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              variant="filled"
              sx={{
                input: { color: "#fff" },
                label: { color: "#ccc" },
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 1,
              }}
            />
          </Paper>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#2563eb",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#1e40af",
                },
              }}
              onClick={handleSubmit}
            >
              {mode === "edit" ? "Update Camera" : "Add Camera"}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AddCameras;
