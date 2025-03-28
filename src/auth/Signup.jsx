import React, { useState } from "react";
import { Container, Grid, Paper, TextField, Typography, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    if (!email) return setError("Please enter an email.");
    if (!password) return setError("Please enter a password.");
    if (password.length < 6) return setError("Password should be at least 6 characters.");
    
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use. Try logging in.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontFamily: "monospace", fontWeight: "bold", letterSpacing: 2 }}>
        FaceTrack
      </Typography>
      <Typography variant="h5" gutterBottom>
        Signup
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, textAlign: "center" }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField fullWidth label="Username" margin="normal" required value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField fullWidth label="Email" margin="normal" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField fullWidth label="Password" type="password" margin="normal" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" color="primary" sx={{ mt: 3 }} fullWidth onClick={handleSignup}>Signup</Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Signup;
