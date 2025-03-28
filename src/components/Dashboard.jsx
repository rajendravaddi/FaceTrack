import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Paper, Drawer, List, ListItem, ListItemText, Box, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || "User");
      } else {
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar Navigation */}
      <Drawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} sx={{ width: 240, flexShrink: 0 }}>
        <Toolbar />
        <Box sx={{ textAlign: "center", p: 2, fontFamily: "monospace", fontWeight: "bold", fontSize: "1.5rem" }}>
          FaceTrack
        </Box>
        {username && (
          <Typography variant="subtitle1" sx={{ textAlign: "center", p: 1 }}>
            Hello, {username}!
          </Typography>
        )}
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
            <ListItem button onClick={handleLogout}>
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
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1, fontFamily: "monospace", fontWeight: "bold", letterSpacing: 2 }}>
              FaceTrack
            </Typography>
            {username && (
              <Typography variant="h6" sx={{ mr: 3 }}>
                {username}
              </Typography>
            )}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>

        {/* Summary Cards */}
        <Container sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="h6">Total Cameras</Typography>
                <Typography variant="h4">5</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="h6">Authorized Faces</Typography>
                <Typography variant="h4">30</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="h6">Live Camera Monitor</Typography>
                <Button variant="contained" color="info" fullWidth component={Link} to="/live-monitor">
                  View Live
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Action Buttons */}
        <Container sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="h5">View Authorized Members</Typography>
                <Button variant="contained" color="primary" fullWidth component={Link} to="/authorized-members">
                  View
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="h5">Add Authorized Members</Typography>
                <Button variant="contained" color="secondary" fullWidth component={Link} to="/add-authorized">
                  Add
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="h5">History</Typography>
                <Button variant="contained" color="success" fullWidth component={Link} to="/history">
                  View History
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="h5">Alerts</Typography>
                <Button variant="contained" color="warning" fullWidth component={Link} to="/alerts">
                  View Alerts
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Dashboard;
