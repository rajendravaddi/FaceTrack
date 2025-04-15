import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
          sx={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
            color: "#fff",
          }}
        >
          Reset Password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

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
          onClick={handlePasswordReset}
        >
          Send Reset Link
        </Button>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
          Remembered your password?{" "}
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

export default ForgotPassword;
