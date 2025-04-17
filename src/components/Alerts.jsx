import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Paper,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useUsername } from "../context/UsernameContext";
import saifImage from "../assets/saif.jpeg"; // Dummy image

const Alerts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState([
    { id: 1, imageUrl: saifImage }, // Default alert with dummy image
  ]);
  const { username } = useUsername(); // 🔐 Get logged-in user
  const navigate = useNavigate(); // Hook for navigation

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const menuItems = [
    ["Dashboard Overview", "/dashboard"],
    ["Add Camera Details", "/add-cameras"],
    ["View Stored Details", "/view-details"],
    ["Add Authorized Members", "/add-authorized"],
    ["View Authorized Members", "/authorized-members"],
    ["History", "/history"],
    ["Alerts", "/alerts"],
    ["Live Camera Monitor", "/live-monitor"],
    ["Logout", "/login"],
  ];

  // Handle "Remove" button action
  const handleRemoveAlert = (id) => {
    // You would typically send a request to the server to delete it for the current user
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    console.log(`Alert ${id} removed for ${username}`); // Log to verify user removal
  };

  // Handle "Authorize Him" action (redirects to AddAuthorizedMembers page)
  const handleAuthorize = (id) => {
    console.log(`Authorizing alert ${id} for ${username}`); // Log to verify authorization

    // Redirecting to the "Add Authorized Member" page
    // You can also pass any data (like the image) via the URL or as state if needed
    navigate("/add-authorized", { state: { alertId: id } });
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
            {menuItems.map(([text, path]) => (
              <ListItem button component={Link} to={path} key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          position="static"
          sx={{ backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}
        >
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
              Alerts
            </Typography>

            {alerts.length === 0 ? (
              <Typography>No alerts to show.</Typography>
            ) : (
              alerts.map((alert) => (
                <Box
                  key={alert.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    padding: 2,
                    borderRadius: 2,
                  }}
                >
                  <img
                    src={alert.imageUrl}
                    alt="Alert"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: "50%",
                      marginRight: 20,
                    }}
                  />
                  <Typography variant="body1" sx={{ color: "#fff", fontWeight: "bold", flexGrow: 1 }}>
                    Unknown person detected
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: 2 }}
                    onClick={() => handleAuthorize(alert.id)}
                  >
                    Authorize Him
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveAlert(alert.id)}
                  >
                    Remove
                  </Button>
                </Box>
              ))
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Alerts;
