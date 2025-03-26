import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email) return setError("Please enter an email.");
    if (!password) return setError("Please enter a password.");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Login with Google successful!");
      navigate("/dashboard"); // Redirect to dashboard after Google login
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
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
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleGoogleLogin}
          style={{ marginTop: 10 }}
        >
          Sign In with Google
        </Button>
        <Typography variant="body2" style={{ marginTop: 10 }}>
          Don't have an account? 
          <Button color="primary" onClick={() => navigate("/signup")} style={{ textTransform: "none" }}>
            Sign Up
          </Button>
        </Typography>
        <Typography variant="body2" style={{ marginTop: 10 }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;

// Added Google Sign-In functionality while retaining all other features.
// Improved error handling for wrong password and user-not-found scenarios.
// Included navigation to Signup and Forgot Password pages for better user experience.