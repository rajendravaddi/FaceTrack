import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    setError("");
    setMessage("");
    if (!email) return setError("Please enter your email.");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("Failed to send password reset email. Try again.");
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>Forgot Password</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handlePasswordReset}>
          Reset Password
        </Button>
        <Typography variant="body2" style={{ marginTop: 10 }}>
          Remembered your password? 
          <Button color="primary" onClick={() => navigate("/login")} style={{ textTransform: "none" }}>
            Login
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;

// Added ForgotPassword component with Firebase password reset functionality.
// Includes input validation and success/error messages.
// Improved error handling for better user experience.
// Added a button to navigate back to the login page.
