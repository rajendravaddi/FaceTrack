// src/components/AlertCard.jsx
import React from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AlertCard = ({ imageUrl, onRemove }) => {
  const navigate = useNavigate();

  const handleAuthorize = () => {
    navigate("/add-authorized", {
      state: { prefillImage: imageUrl },
    });
  };

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        mb: 2,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        color: "#fff",
      }}
    >
      {/* Image */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt="Unknown face"
        sx={{ width: 100, height: 100, borderRadius: 2, mr: 2 }}
      />

      {/* Message */}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6">Unknown person detected</Typography>
      </CardContent>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="success" onClick={handleAuthorize}>
          Authorize Him
        </Button>
        <Button variant="outlined" color="error" onClick={onRemove}>
          Remove
        </Button>
      </Box>
    </Card>
  );
};

export default AlertCard;
