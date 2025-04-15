import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Paper, Drawer, List, ListItem, ListItemText, Box, IconButton, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

// ...all imports remain the same

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
    <div style={{ display: "flex" }}>
      <Drawer open={sidebarOpen} onClose={toggleSidebar} sx={{ width: 240, flexShrink: 0 }}>
        <Toolbar />
        <Box sx={{ textAlign: "center", p: 2, fontFamily: "monospace", fontWeight: "bold", fontSize: "1.5rem" }}>
          FaceTrack
        </Box>
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button component={Link} to="/dashboard">
              <ListItemText primary="Dashboard Overview" />
            </ListItem>
            <ListItem button component={Link} to="/add-cameras">
              <ListItemText primary="Add Cameras" />
            </ListItem>
            <ListItem button component={Link} to="/view-details">
              <ListItemText primary="View Stored Details" />
            </ListItem>
            <ListItem button component={Link} to="/add-authorized">
              <ListItemText primary="Add Authorized Members" />
            </ListItem>
            <ListItem button component={Link} to="/authorized-members">
              <ListItemText primary="View Authorized Members" />
            </ListItem>
            <ListItem button component={Link} to="/history">
              <ListItemText primary="History" />
            </ListItem>
            <ListItem button component={Link} to="/alerts">
              <ListItemText primary="Alerts" />
            </ListItem>
            <ListItem button component={Link} to="/live-monitor">
              <ListItemText primary="Live Camera Monitor" />
            </ListItem>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1, fontFamily: "monospace", fontWeight: "bold", letterSpacing: 2 }}>
              FaceTrack
            </Typography>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Add Cameras</Typography>
            <Button variant="outlined" component={Link} to="/view-details">
              View Cameras
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">Camera Details</Typography>

                <TextField
                  fullWidth
                  label="Camera Name"
                  margin="normal"
                  required
                  value={cameraName}
                  onChange={(e) => setCameraName(e.target.value)}
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
                  />
                ))}

                {ipAddress.length < 4 && (
                  <Button onClick={handleAddIpField} sx={{ mt: 1 }}>
                    + Add Camera
                  </Button>
                )}

                <TextField
                  fullWidth
                  label="Location (Optional)"
                  margin="normal"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Paper>
            </Grid>
          </Grid>

          <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
            Submit
          </Button>
        </Container>
      </Box>
    </div>
  );
};

export default AddCameras;
