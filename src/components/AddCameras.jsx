// AddCameras.js

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  TextField,
  Paper
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const AddCameras = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cameraName, setCameraName] = useState("");
  const [ipAddress, setIpAddress] = useState([""]);
  const [location, setLocation] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Add new IP input (max 4)
  const handleAddIpField = () => {
    if (ipAddress.length < 4) {
      setIpAddress([...ipAddress, ""]);
    }
  };

  // Update a specific IP input
  const handleIpChange = (index, value) => {
    const updatedIps = [...ipAddress];
    updatedIps[index] = value;
    setIpAddress(updatedIps);
  };

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:5000/api/cameras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: cameraName,
        ipAddress,
        location,
      }),
    });

    if (response.ok) {
      alert("Camera(s) added successfully!");
      setCameraName("");
      setIpAddress([""]);
      setLocation("");
    } else {
      alert("Failed to add camera(s).");
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
      {/* Sidebar */}
      <Drawer open={sidebarOpen} onClose={toggleSidebar} sx={{ width: 240, flexShrink: 0 }}>
        <Toolbar />
        <Box sx={{ textAlign: "center", p: 2, fontFamily: "monospace", fontWeight: "bold", fontSize: "1.5rem" }}>
          FaceTrack
        </Box>
        <Box sx={{ overflow: "auto" }}>
          <List>
            {[["Dashboard Overview", "/dashboard"],
              ["Add Camera Details", "/add-cameras"],
              ["View Stored Details", "/view-details"],
              ["Add Authorized Members", "/add-authorized"],
              ["View Authorized Members", "/authorized-members"],
              ["History", "/history"],
              ["Alerts", "/alerts"],
              ["Live Camera Monitor", "/live-monitor"],
              ["Logout", "/login"]
            ].map(([text, path]) => (
              <ListItem button component={Link} to={path} key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
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
              Add Camera Details
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

            {/* Render multiple IP Address fields */}
            {ipAddress.map((ip, index) => (
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

            {ipAddress.length < 4 && (
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
                + Add Camera
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
              Submit
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AddCameras;
