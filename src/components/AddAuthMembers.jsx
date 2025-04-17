// AddAuthorizedMember.js

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  TextField,
  Paper
} from "@mui/material";
import { deleteFaceFromNgrok } from "../utils/faceUtils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useUsername } from "../context/UsernameContext";

const AddAuthorizedMember = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { prefillImage } = location.state || {};

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { username } = useUsername();

  const [name, setName] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (prefillImage) {
      // Convert base64 string to a Blob and File
      fetch(prefillImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "unknown_face.jpg", { type: blob.type });
          setImageFiles([file]);
          setPreviews([URL.createObjectURL(file)]);
        });
    }
  }, [prefillImage]);

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
      const formDataNgrok = new FormData();
      formDataNgrok.append("user_id", username);
      formDataNgrok.append("name", name);
      imageFiles.forEach((file) => {
        formDataNgrok.append("files", file);
      });

      try {
        // Step 2: Send to ngrok server first
        const ngrokResponse = await fetch("https://b04c-35-194-153-195.ngrok-free.app/add-face", {
          method: "POST",
          body: formDataNgrok,
        });

        if (ngrokResponse.ok) {
          const formData = new FormData();
          formData.append("name", name);
          formData.append("username", username);
          imageFiles.forEach((file) => {
            formData.append("images", file);
          });

          try {
            const res = await fetch("http://localhost:5000/api/faces", {
              method: "POST",
              body: formData,
            });

            if (res.ok) {
              alert("Authorized face added successfully!");
              setName("");
              setImageFiles([]);
              setPreviews([]);
              navigate("/authorized-members");
            } else {
              await deleteFaceFromNgrok(username, name);
              if (res.status === 409) {
                const error = await res.json();
                console.log(error.error);
              }
            }
          } catch (err) {
            console.error(err);
          }
        } else {
          const error = await ngrokResponse.json();
          alert("Ngrok Error: " + error.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    await handleAddFace();
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
              Add Authorized Member
            </Typography>

            <TextField
              fullWidth
              label="Person Name"
              margin="normal"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="filled"
              sx={{
                input: { color: "#fff" },
                label: { color: "#ccc" },
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 1,
              }}
            />
            <TextField
              fullWidth
              label="Position (Optional)"
              margin="normal"
              variant="filled"
              sx={{
                input: { color: "#fff" },
                label: { color: "#ccc" },
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 1,
              }}
            />

            <Typography variant="h6" sx={{ mt: 2 }}>
              Upload Face Images (Max 4)
            </Typography>

            <Box sx={{ mt: 2 }}>
              {imageFiles.map((_, index) => (
                <Box key={index} sx={{ position: "relative", mt: 2 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    style={{ display: "block", margin: "10px auto", color: "#fff" }}
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
                          "&:hover": { backgroundColor: "#eee" },
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
                  onClick={handleAddImageField}
                  sx={{
                    mt: 2,
                    color: "#fff",
                    borderColor: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "#ccc",
                    },
                  }}
                >
                  + Add Face
                </Button>
              )}

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#2563eb",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#1e40af",
                    },
                  }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AddAuthorizedMember;
