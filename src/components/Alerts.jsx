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
  Dialog,
  DialogTitle,
  DialogContent,
  ListItemText,
  Container,
  Paper,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useUsername } from "../context/UsernameContext";
import CloseIcon from "@mui/icons-material/Close";
import { deleteFaceFromNgrok } from "../utils/faceUtils";


const Alerts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const { username } = useUsername();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("unknownFaces") || "[]");
  
    const alertsArray = stored.map((alert) => ({
      id: alert.name, // unique per session
      name: alert.name,
      timestamp: alert.timestamp,
      image: alert.image || "", // already contains base64 string
      original_image64: alert.original_image,
    }));
  
    setAlerts(alertsArray);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleRemoveAlert = async (alert_) => {
    try {
          const ngrokResponse = await deleteFaceFromNgrok(username, alert_.name);
    
          if (!ngrokResponse.success) {
            console.error("Ngrok deletion failed:", ngrokResponse.message);
            return;
          }
  
        } catch (error) {
          console.error("Error during face removal process:", error);
        }

    const updatedAlerts = alerts.filter((alert) => alert.id !== alert_.id);
    setAlerts(updatedAlerts);
  
    // Filter it out of localStorage
    const stored = JSON.parse(localStorage.getItem("unknownFaces") || "[]");
    const newStored = stored.filter((alert) => alert.name !== alert_.id);
    localStorage.setItem("unknownFaces", JSON.stringify(newStored));
  
    console.log(`Alert ${alert_.id} removed for ${username}`);
  };
  const [openDialog, setOpenDialog] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);

const handleImageClick = (image) => {
  setSelectedImage(image);
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
  setSelectedImage(null);
};

  const handleAuthorize = (id) => {
    console.log(`Authorizing alert ${id} for ${username}`);
    navigate("/add-authorized", { state: { alertId: id } });
  };

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
              <Typography>No unknown face alerts to show.</Typography>
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
                  {/* Image rendering */}
                  <img
    src={alert.image} // Use 'alert.image' instead of 'alert.imageUrl'
    alt={alert.name}
    onClick={() => handleImageClick(alert.original_image64)}
    style={{
        width: 100,
        height: 100,
        objectFit: "cover",
        borderRadius: "50%",
        marginRight: 20,
    }}
/>
                  <Typography variant="body1" sx={{ color: "#fff", fontWeight: "bold", flexGrow: 1 }}>
                    {alert.name} detected
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
                    onClick={() => handleRemoveAlert(alert)}
                  >
                    Remove
                  </Button>
                </Box>
              ))
            )}
          </Paper>
        </Container>
        {/* Dialog to show enlarged image */}
<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
  <DialogTitle>
    Face Snapshot
    <IconButton
      aria-label="close"
      onClick={handleCloseDialog}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    {selectedImage && (
      <img
        src={selectedImage}
        alt="Enlarged Face"
        style={{ width: "100%", height: "auto", borderRadius: "12px" }}
      />
    )}
  </DialogContent>
</Dialog>

      </Box>
    </Box>
  );
};

export default Alerts;

