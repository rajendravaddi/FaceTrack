import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Button,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useUsername } from "../context/UsernameContext"; // ✅ import context

const ViewStoredDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("cameraName");

  const { username } = useUsername(); // ✅ get username

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchCameras = async () => {
    if (!username) return; // ✅ don't fetch if username is missing

    try {
      const response = await fetch(`http://localhost:5000/api/cameras/${username}`);
      const data = await response.json();
      setCameras(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  useEffect(() => {
    console.log("Username inside useEffect:", username); // ✅ debug log
    if (username) {
      fetchCameras();
    }
  }, [username]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this camera?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/cameras/${id}/${username}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        fetchCameras(); // ✅ refresh after deletion
      } else {
        console.error("Failed to delete camera");
      }
    } catch (err) {
      console.error("Error deleting camera:", err);
    }
  };
  

  const filteredCameras = cameras.filter((camera) =>
    camera[filterBy]?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, rgba(15,23,42,0.9), rgba(30,58,138,0.85))",
        display: "flex",
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" sx={{ color: "#fff" }}>Stored Camera Details</Typography>
            <Button variant="contained" component={Link} to="/add-cameras">
              + Add Camera
            </Button>
          </Box>

          {/* Filters */}
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <TextField
              label={`Filter by ${filterBy}`}
              variant="outlined"
              fullWidth
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              sx={{
                mr: 2,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 1,
                input: { color: "#fff" },
              }}
              InputLabelProps={{ style: { color: "#ccc" } }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ color: "#ccc" }}>Filter By</InputLabel>
              <Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                label="Filter By"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              >
                <MenuItem value="cameraName">Camera Name</MenuItem>
                <MenuItem value="ipAddress">IP Address</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Camera Table or Message */}
          {filteredCameras.length === 0 ? (
            <Box textAlign="center" mt={10} color="#fff">
              <Typography variant="h6" gutterBottom>
                No cameras added yet.
              </Typography>
              <Typography variant="body1" mb={3}>
                Start by adding a camera to begin monitoring.
              </Typography>
              <Button variant="contained" component={Link} to="/add-cameras">
                Add Camera Now
              </Button>
            </Box>
          ) : (
            <Paper
              sx={{
                backgroundColor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Camera Name</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>IP Address</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Location</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCameras.map((camera) => (
                    <TableRow key={camera._id}>
                      <TableCell sx={{ color: "#fff" }}>{camera.cameraName}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{camera.ipAddress}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{camera.location || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(camera._id)}
                          sx={{
                            color: "white",
                            '&:hover': {
                              backgroundColor: "#b71c1c",
                            }
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
