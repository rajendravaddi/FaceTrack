import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./HeroSection.css"; // your background CSS

const Dashboard = () => {


  return (
    <div className="hero-container">
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#1f1f2e" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", letterSpacing: 2 }}>
            FaceTrack
          </Typography>
          <Box>
            <Button color="inherit" component={Link} to="/view-details" sx={{ marginRight: 2 }}>
              Cameras
            </Button>
            <Button color="inherit" component={Link} to="/authorized-members" sx={{ marginRight: 2 }}>
              Faces
            </Button>
            <Button color="inherit" component={Link} to="/alerts" sx={{ marginRight: 2 }}>
              Alerts
            </Button>
            <Button color="inherit" component={Link} to="/history" sx={{ marginRight: 2 }}>
              History
            </Button>
            <Button color="inherit" component={Link} to="/login" sx={{ marginRight: 2 }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Centered Content (Optional Welcome Message or Overview) */}
      <Box
  sx={{
    height: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
    px: 2,
  }}
>
  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
    Welcome to FaceTrack
  </Typography>
  <Typography variant="h6" sx={{ maxWidth: "600px", mb: 4 }}>
    Manage your surveillance system with ease — add cameras, authorize faces,
    track alerts, and view history from one dashboard.
  </Typography>

  {/* Live Monitor Button */}
  <Button
    variant="contained"
    color="success"
    size="large"
    component={Link}
    to="/live-monitor"
    sx={{
      textTransform: "none",
      fontWeight: "bold",
      px: 4,
      py: 1.5,
      borderRadius: "12px",
      boxShadow: 3,
    }}
  >
    Live Monitor
  </Button>
</Box>

      
    </div>
  );
};

export default Dashboard;
