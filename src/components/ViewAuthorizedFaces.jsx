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
  Button,
  Container,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { deleteFaceFromNgrok } from "../utils/faceUtils";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { useUsername } from "../context/UsernameContext";

const ViewAuthorizedMembers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [faces, setFaces] = useState([]);
  const [filterText, setFilterText] = useState("");
  const { username } = useUsername();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ⏳ 5-second face carousel for each member
  const FaceImageCarousel = ({ face }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
      if (!face.images || face.images.length === 0) return;

      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % face.images.length);
      }, 5000);

      return () => clearInterval(interval);
    }, [face.images]);

    if (!face.images || face.images.length === 0) {
      return <Typography>No image</Typography>;
    }

    return (
      <img
        src={`http://localhost:5000${face.images[index].imageUrl}`}
        alt={face.name}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          objectFit: "cover",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    );
  };

  // 🧠 Load all authorized faces for this user
  useEffect(() => {
    if (!username) return;

    const fetchFaces = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/faces", {
          params: { username },
        });
        setFaces(res.data);
      } catch (error) {
        console.error("Error fetching authorized faces:", error);
      }
    };

    fetchFaces();
  }, [username]);

  // ❌ Remove member and their images
  /*const handleRemove = async (removeMember) => {
    try {
      await axios.delete(`http://localhost:5000/api/faces/${removeMember._id}`);
      setFaces((prevFaces) => prevFaces.filter((face) => face._id !== removeMember._id));
    } catch (error) {
      console.error("Error deleting face:", error);
    }
  };*/

  const handleRemove = async (removeMember) => {
  
    try {
      // Step 1: Delete from Ngrok server
      const ngrokResponse = await deleteFaceFromNgrok(username, removeMember.name);
  
      if (!ngrokResponse.success) {
        console.error("Ngrok deletion failed:", ngrokResponse.message);
        return; // Don't proceed to local delete
      }
  
      // Step 2: Delete from localhost
      await axios.delete(`http://localhost:5000/api/faces/${removeMember._id}`);
      setFaces((prevFaces) => prevFaces.filter((face) => face._id !== removeMember._id));
  
      console.log("Successfully deleted from ngrok and localhost.");
    } catch (error) {
      console.error("Error during face removal process:", error);
    }
  };

  // 🔍 Filter faces by name
  const filteredFaces = faces.filter((face) =>
    face.name.toLowerCase().includes(filterText.toLowerCase())
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
            {[["Dashboard Overview", "/dashboard"],
              ["Add Cameras", "/add-cameras"],
              ["View Stored Details", "/view-details"],
              ["Add Authorized Members", "/add-authorized"],
              ["View Authorized Members", "/authorized-members"],
              ["History", "/history"],
              ["Alerts", "/alerts"],
              ["Live Camera Monitor", "/live-monitor"],
              ["Logout", "/login"]].map(([label, path]) => (
              <ListItem button component={Link} to={path} key={label}>
                <ListItemText primary={label} />
              </ListItem>
            ))}
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
            <Typography variant="h5">Authorized Members</Typography>
            <Button variant="contained" component={Link} to="/add-authorized">
              + Add Authorized Face
            </Button>
          </Box>

          <TextField
            label="Filter by name"
            variant="outlined"
            fullWidth
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            sx={{ mb: 3 }}
          />

          {filteredFaces.length === 0 ? (
            <Box textAlign="center" mt={10}>
              <Typography variant="h6" gutterBottom>
                No authorized faces found.
              </Typography>
              <Typography variant="body1" mb={3}>
                Try changing your search or add a new face.
              </Typography>
              <Button variant="outlined" component={Link} to="/add-authorized">
                Add Authorized Face
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredFaces.map((face) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={face._id}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <FaceImageCarousel face={face} />
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      {face.name}
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => handleRemove(face)}
                    >
                      Remove
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </div>
  );
};

export default ViewAuthorizedMembers;
