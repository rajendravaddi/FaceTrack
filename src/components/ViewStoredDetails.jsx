// ViewStoredDetails.jsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useUsername } from "../context/UsernameContext";

const ViewStoredDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cameras, setCameras] = useState([]);
  const { username } = useUsername();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cameras/${username}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setCameras(data);
        } else if (data && typeof data === "object") {
          setCameras([data]);
        } else {
          setCameras([]);
        }
      } catch (error) {
        console.error("Error fetching cameras:", error);
        setCameras([]);
      }
    };

    if (username) {
      fetchCameras();
    }
  }, [username]);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this camera?");
      if (!confirmDelete) return;

      const response = await fetch(`http://localhost:5000/api/cameras/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const updatedResponse = await fetch(`http://localhost:5000/api/cameras/${username}`);
        const updatedData = await updatedResponse.json();

        if (Array.isArray(updatedData)) {
          setCameras(updatedData);
        } else if (updatedData && typeof updatedData === "object") {
          setCameras([updatedData]);
        } else {
          setCameras([]);
        }
      } else {
        console.error("Failed to delete camera");
      }
    } catch (err) {
      console.error("Error deleting camera:", err);
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" gutterBottom sx={{ color: "#fff", fontWeight: "bold" }}>
              Stored Camera Details
            </Typography>

            {cameras.length === 0 ? (
              <Button
                variant="contained"
                component={Link}
                to="/add-cameras"
                sx={{ backgroundColor: "#2563eb", "&:hover": { backgroundColor: "#1e40af" } }}
              >
                + Add Camera
              </Button>
            ) : (
              <Button
                variant="contained"
                component={Link}
                to="/add-cameras?mode=edit"
                sx={{ backgroundColor: "#2563eb", "&:hover": { backgroundColor: "#1e40af" } }}
              >
                + Update Camera
              </Button>
            )}
          </Box>

          {cameras.length === 0 ? (
            <Box textAlign="center" mt={10}>
              <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
                No cameras added yet.
              </Typography>
              <Typography variant="body1" mb={3} sx={{ color: "#ccc" }}>
                Start by adding a camera to begin monitoring your surroundings.
              </Typography>
              <Button
                variant="outlined"
                component={Link}
                to="/add-cameras"
                sx={{
                  borderColor: "#fff",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderColor: "#ccc",
                  },
                }}
              >
                Add Camera Now
              </Button>
            </Box>
          ) : (
            <Paper sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)", padding: 3, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#fff" }}><strong>Name</strong></TableCell>
                    <TableCell sx={{ color: "#fff" }}><strong>IP Address</strong></TableCell>
                    <TableCell sx={{ color: "#fff" }}><strong>Location</strong></TableCell>
                    <TableCell sx={{ color: "#fff" }}><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cameras.map((camera) => (
                    <TableRow key={camera._id}>
                      <TableCell sx={{ color: "#fff" }}>{camera.cameraName}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>
                        {Array.isArray(camera.ipAddresses)
                          ? camera.ipAddresses.join(", ")
                          : camera.ipAddresses || "-"}
                      </TableCell>
                      <TableCell sx={{ color: "#fff" }}>{camera.location || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(camera._id)}
                          sx={{
                            borderColor: "#fff",
                            color: "#fff",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.1)",
                              borderColor: "#ccc",
                            },
                          }}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default ViewStoredDetails;
