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
  Grid,
  Paper,
  Button
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";

const ViewAuthorizedMembers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [faces, setFaces] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchFaces = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faces");
      setFaces(res.data);
    } catch (error) {
      console.error("Error fetching authorized faces:", error);
    }
  };

  useEffect(() => {
    fetchFaces();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/faces/${id}`);
      setFaces(faces.filter((face) => face._id !== id));
    } catch (error) {
      console.error("Error deleting face:", error);
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
              <ListItemText primary="Add User & Camera Details" />
            </ListItem>
            <ListItem button component={Link} to="/view-details">
              <ListItemText primary="View Stored Details" />
            </ListItem>
            <ListItem button component={Link} to="/authorized-members">
              <ListItemText primary="View Authorized Members" />
            </ListItem>
            <ListItem button component={Link} to="/add-authorized">
              <ListItemText primary="Add Authorized Members" />
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

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Authorized Members
          </Typography>
          <Grid container spacing={2}>
            {faces.map((face) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={face._id}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <img
                    src={`http://localhost:5000${face.imageUrl}`}
                    alt={face.name}
                    style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                  />
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    {face.name}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => handleRemove(face._id)}
                  >
                    Remove
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default ViewAuthorizedMembers;
