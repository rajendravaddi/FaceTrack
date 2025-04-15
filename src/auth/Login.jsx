import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useUsername } from "../context/UsernameContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUsername } = useUsername();

  const handleLogin = async () => {
    setError("");
    if (!email) return setError("Please enter your email.");
    if (!password) return setError("Please enter your password.");

    try {
      const userCredential=await signInWithEmailAndPassword(auth, email, password);
      const name = userCredential.user.displayName || email.split("@")[0]; // fallback if no displayName
      setUsername(name);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      switch (err.code) {
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Try again later.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const userCredential=await signInWithPopup(auth, googleProvider);
      const name =
  userCredential.user.displayName ||
  userCredential.user.email?.split("@")[0] ||
  "User"; // fallback if no displayName
      setUsername(name);
      alert("Login with Google successful!");
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed. Please try again.");
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
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
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
            backgroundColor: "#2563eb",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#1e40af",
            },
          }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleLogin}
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
          Sign in with Google
        </Button>

        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: "center", color: "#ccc" }}
        >
          Don't have an account?{" "}
          <Button
            color="primary"
            onClick={() => navigate("/signup")}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Sign Up
          </Button>
        </Typography>

        <Typography
          variant="body2"
          sx={{ mt: 1, textAlign: "center", color: "#ccc" }}
        >
          <Link to="/forgot-password" style={{ color: "#90cdf4" }}>
            Forgot Password?
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
