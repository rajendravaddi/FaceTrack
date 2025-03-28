import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Paper, Drawer, List, ListItem, ListItemText, Box, IconButton, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const AddAuthorizedMember = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [image, setImage] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar Navigation */}
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
      
      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Navbar */}
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

        {/* Add Authorized Member Form */}
        <Container sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Add Authorized Member
          </Typography>
          <Grid container spacing={3}>
            {/* Person Details */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2 }}>
                <TextField fullWidth label="Person Name" margin="normal" required />
                <TextField fullWidth label="Position (Optional)" margin="normal" />
                {/* Image Upload */}
                <Typography variant="h6" sx={{ mt: 2 }}>Upload Face Image</Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "block", margin: "10px auto" }}
                />
                {image && <img src={image} alt="Uploaded" style={{ width: "100px", height: "100px", marginTop: "10px" }} />}
              </Paper>
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" sx={{ mt: 3 }}>Submit</Button>
        </Container>
      </Box>
    </div>
  );
};

export default AddAuthorizedMember;
