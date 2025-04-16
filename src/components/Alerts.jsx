// src/components/Alerts.jsx

import React, { useState } from "react";
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
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const Alerts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <Drawer
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{ width: 240, flexShrink: 0 }}
      >
        <Toolbar />
        <Box
          sx={{
            textAlign: "center",
            p: 2,
            fontFamily: "monospace",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
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
          sx={{
            backgroundColor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleSidebar}
              sx={{ mr: 2 }}
            >
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
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#fff" }}
            >
              Alerts
            </Typography>
            {/* TODO: Add your alerts content here */}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Alerts;
