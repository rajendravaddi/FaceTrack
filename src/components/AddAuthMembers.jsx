import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  TextField
} from "@mui/material";
import { deleteFaceFromNgrok } from "../utils/faceUtils";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useUsername } from "../context/UsernameContext";

const AddAuthorizedMember = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { username } = useUsername();

  const [name, setName] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddImageField = () => {
    if (imageFiles.length >= 4) {
      alert("You can upload up to 4 images only.");
      return;
    }

    setImageFiles([...imageFiles, null]);
    setPreviews([...previews, null]);
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedFiles = [...imageFiles];
    updatedFiles[index] = file;
    setImageFiles(updatedFiles);

    const updatedPreviews = [...previews];
    updatedPreviews[index] = URL.createObjectURL(file);
    setPreviews(updatedPreviews);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...previews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setImageFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async () => {
    if (!name || imageFiles.length === 0 || imageFiles.some((f) => !f)) {
      alert("Please enter a name and upload at least one image.");
      return;
    }
    const handleAddFace = async () => {
      // Step 1: Prepare form data for ngrok
      const formDataNgrok = new FormData();
      formDataNgrok.append("user_id", username);
      formDataNgrok.append("name", name);
      //formDataNgrok.append("files", imageFile); // webcam or file input
      imageFiles.forEach((file) => {
        formDataNgrok.append("files", file);
      });

      try {
        // Step 2: Send to ngrok server first
        const ngrokResponse = await fetch("https://b04c-35-194-153-195.ngrok-free.app/add-face", {
          method: "POST",
          body: formDataNgrok,
        });
        //alert("Sending data to ngrok server");
        if (ngrokResponse.ok) {
          console.log("Face data successfully sent to Ngrok server!");
          const formData = new FormData();
          formData.append("name", name);
          formData.append("username", username);
          imageFiles.forEach((file) => {
            formData.append("images", file);
          });
          // Step 4: Send to localhost API
          try {
            const res = await fetch("http://localhost:5000/api/faces", {
              method: "POST",
              body: formData,
            });

            if (res.ok) {
             // alert("Authorized face added successfully!");
              setName("");
              setImageFiles(null);
              setImage(null);
            } else {
              const error = await res.json();
             // alert("Error: " + error.error);
              const result = await deleteFaceFromNgrok(username, name);
              /*if(result.success){
                alert("Faces deleted from model");
              }*/
            }

            // Handle specific status 409 Conflict
            if (res.status === 409) {
              const error = await res.json();
              alert(error.error);
            }

          } catch (err) {
            console.error(err);
            //alert("Something went wrong while connecting to localhost.");
            
          }

        } else {
          const error = await ngrokResponse.json();
          alert("Ngrok Error: " + error.message); // or error.error based on your backend
        }

      } catch (err) {
        console.error(err);
        alert("Something went wrong while connecting to Ngrok server.");
      }
    };
    await handleAddFace();

  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
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
              <ListItemText primary="Add Camera Details" />
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

      {/* Main Content */}
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
          <Typography variant="h5" gutterBottom>
            Add Authorized Member
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2 }}>
                <TextField
                  fullWidth
                  label="Person Name"
                  margin="normal"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField fullWidth label="Position (Optional)" margin="normal" />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Upload Face Images (Max 4)
                </Typography>

                {imageFiles.map((_, index) => (
                  <Box key={index} sx={{ position: "relative", mt: 2 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      style={{ display: "block", margin: "10px auto" }}
                    />
                    {previews[index] && (
                      <Box sx={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={previews[index]}
                          alt={`Face ${index + 1}`}
                          style={{ width: "100px", height: "100px", borderRadius: 4 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(index)}
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            backgroundColor: "#fff",
                            "&:hover": { backgroundColor: "#eee" }
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                ))}

                {imageFiles.length < 4 && (
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={handleAddImageField}
                  >
                    + Add Face
                  </Button>
                )}
              </Paper>
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
            Submit
          </Button>
        </Container>
      </Box>
    </div>
  );
};

export default AddAuthorizedMember;
