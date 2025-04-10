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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const ViewStoredDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("name");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cameras");
        const data = await response.json();
        setCameras(data);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this camera?");
      if (!confirmDelete) return;

      const response = await fetch(`http://localhost:5000/api/cameras/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedResponse = await fetch("http://localhost:5000/api/cameras");
        const updatedData = await updatedResponse.json();
        setCameras(updatedData);
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
            <Typography variant="h5" gutterBottom>
              Stored Camera Details
            </Typography>
            <Button variant="contained" component={Link} to="/add-cameras">
              + Add Camera
            </Button>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <TextField
              label={`Filter by ${filterBy}`}
              variant="outlined"
              fullWidth
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              sx={{ mr: 2 }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 160 }}>
              <InputLabel>Filter By</InputLabel>
              <Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                label="Filter By"
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="ipAddress">IP Address</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {filteredCameras.length === 0 ? (
            <Box textAlign="center" mt={10}>
              <Typography variant="h6" gutterBottom>
                No cameras added yet.
              </Typography>
              <Typography variant="body1" mb={3}>
                Start by adding a camera to begin monitoring your surroundings.
              </Typography>
              <Button variant="outlined" component={Link} to="/add-cameras">
                Add Camera Now
              </Button>
            </Box>
          ) : (
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>IP Address</strong></TableCell>
                    <TableCell><strong>Location</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCameras.map((camera) => (
                    <TableRow key={camera._id}>
                      <TableCell>{camera.name}</TableCell>
                      <TableCell>{camera.ipAddress}</TableCell>
                      <TableCell>{camera.location || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(camera._id)}
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
    </div>
  );
};

export default ViewStoredDetails;
