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
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const History = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groupedHistory, setGroupedHistory] = useState({});

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

  useEffect(() => {
    const historyData = JSON.parse(localStorage.getItem("faceHistory")) || {};
    setGroupedHistory(historyData);
  }, []);

  const exportToCSV = () => {
    const historyData = JSON.parse(localStorage.getItem("faceHistory")) || {};
    let csv = "Time Bucket,Recognized Names\n";
    Object.entries(historyData).forEach(([bucket, names]) => {
      csv += `${bucket},"${names.join(", ")}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "face_history.csv");
    link.click();
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
              History
            </Typography>

            {Object.entries(groupedHistory).length === 0 ? (
              <Typography>No face recognition history found.</Typography>
            ) : (
              Object.entries(groupedHistory).map(([bucket, names]) => (
                <Box key={bucket} sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ color: "#90caf9", fontWeight: "bold" }}>
                    {bucket}
                  </Typography>
                  <ul style={{ marginLeft: "1.5rem" }}>
                    {names.map((name, idx) => (
                      <li key={idx} style={{ fontSize: "1rem" }}>{name}</li>
                    ))}
                  </ul>
                </Box>
              ))
            )}

            <Box sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                onClick={exportToCSV}
                sx={{
                  borderColor: "#90caf9",
                  color: "#90caf9",
                  "&:hover": {
                    borderColor: "#64b5f6",
                    backgroundColor: "rgba(144,202,249,0.1)",
                  },
                }}
              >
                Export to CSV
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default History;
