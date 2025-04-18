//currently there will exist a error if we add more than one camera for user ...i dont know why....
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useUsername } from "../context/UsernameContext"; // ✅ Import context

const AddCameras = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cameraName, setCameraName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState("");

  const { username } = useUsername(); // ✅ Access username

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:5000/api/cameras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username,cameraName, ipAddress, location }), // ✅ Include username
    });

    if (response.ok) {
      alert("Camera added successfully!");
      setCameraName("");
      setIpAddress("");
      setLocation("");
    } else {
      alert("Failed to add camera.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(to right, rgba(15,23,42,0.9), rgba(30,58,138,0.85))",
      }}
    >
      {/* Sidebar */}
      <Drawer open={sidebarOpen} onClose={toggleSidebar} sx={{ width: 240 }}>
        <Toolbar />
        <Box sx={{ textAlign: "center", p: 2, fontFamily: "monospace", fontWeight: "bold", fontSize: "1.5rem" }}>
          FaceTrack
        </Box>
        <List>
          {[
            ["Dashboard Overview", "/dashboard"],
            ["Add Cameras", "/add-cameras"],
            ["View Stored Details", "/view-details"],
            ["Add Authorized Members", "/add-authorized"],
            ["View Authorized Members", "/authorized-members"],
            ["History", "/history"],
            ["Alerts", "/alerts"],
            ["Live Camera Monitor", "/live-monitor"],
            ["Logout", "/login"],
          ].map(([label, path]) => (
            <ListItem button component={Link} to={path} key={label}>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static" sx={{ backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontFamily: "monospace", fontWeight: "bold", letterSpacing: 2, color: "#fff" }}>
              FaceTrack
            </Typography>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ color: "#fff" }}>Add Camera</Typography>
            <Button variant="contained" component={Link} to="/view-details">
              View Cameras
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                }}
              >
                <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                  Camera Details
                </Typography>
                <TextField
                  fullWidth
                  label="Camera Name"
                  margin="normal"
                  required
                  value={cameraName}
                  onChange={(e) => setCameraName(e.target.value)}
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{ style: { color: "#fff" } }}
                />
                <TextField
                  fullWidth
                  label="IP Address"
                  margin="normal"
                  required
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{ style: { color: "#fff" } }}
                />
                <TextField
                  fullWidth
                  label="Location (Optional)"
                  margin="normal"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{ style: { color: "#fff" } }}
                />
              </Paper>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, backgroundColor: "#2563eb" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default AddCameras;
