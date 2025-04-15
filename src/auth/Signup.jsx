import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useUsername } from "../context/UsernameContext"; // Importing your context

const Signup = () => {
  const navigate = useNavigate();
  const { setUsername } = useUsername(); // Accessing context to store username
  const [username, setUsernameLocal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for buttons

  const handleSignup = async () => {
    setError("");
    if (!email) return setError("Please enter an email.");
    if (!password) return setError("Please enter a password.");
    if (password.length < 6)
      return setError("Password should be at least 6 characters.");

    setLoading(true); // Set loading to true when the request starts

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Set username in Firebase Profile and context
      await updateProfile(userCredential.user, { displayName: username });
      setUsername(username || email.split("@")[0]); // Set context globally

      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      // Handle errors
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use. Try logging in.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false); // Set loading to false after request finishes
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, rgba(15,23,42,0.9), rgba(30,58,138,0.85))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "#fff" }}
        >
          Sign Up to FaceTrack
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Username"
          variant="filled"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsernameLocal(e.target.value)}
          sx={{
            input: { color: "#fff" },
            label: { color: "#ccc" },
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 1,
          }}
        />
        <TextField
          label="Email"
          variant="filled"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            input: { color: "#fff" },
            label: { color: "#ccc" },
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 1,
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="filled"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            input: { color: "#fff" },
            label: { color: "#ccc" },
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 1,
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            backgroundColor: "#16a34a",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#15803d",
            },
          }}
          onClick={handleSignup}
          disabled={loading} // Disable the button when loading
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "#ccc" }}>
          Already have an account?{" "}
          <Button
            color="success"
            size="small"
            onClick={() => navigate("/login")}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Login
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;
