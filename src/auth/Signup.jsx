import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    if (!email) return setError("Please enter an email.");
    if (!password) return setError("Please enter a password.");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
      navigate("/login"); // Redirect to login after signup
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use. Try logging in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleSignup}>
          Sign Up
        </Button>
        <Typography variant="body2" style={{ marginTop: 10 }}>
          Already have an account? 
          <Button color="primary" onClick={() => navigate("/login")} style={{ textTransform: "none" }}>
            Login
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Signup;

// Added improved error handling for email already in use, invalid email format, and weak password.
// Included navigation to Login page for better user experience.
