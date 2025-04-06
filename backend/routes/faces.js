const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const AuthorizedFace = require("../models/AuthorizedFace");
const fs = require("fs");


// Setup multer for storing images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/faces/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Add an authorized face (with image)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const imageUrl = `/uploads/faces/${req.file.filename}`;

    const newFace = new AuthorizedFace({ name, imageUrl });
    await newFace.save();

    res.status(201).json(newFace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all authorized faces
router.get("/", async (req, res) => {
  try {
    const faces = await AuthorizedFace.find();
    res.json(faces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// DELETE an authorized face by ID
router.delete("/:id", async (req, res) => {
    try {
      const face = await AuthorizedFace.findById(req.params.id);
      if (!face) return res.status(404).json({ message: "Face not found" });
  
      // Remove the image file from the filesystem
      const imagePath = path.join(__dirname, "..", face.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
  
      // Remove from DB
      await AuthorizedFace.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Authorized face deleted successfully" });
    } catch (error) {
      console.error("Error deleting face:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
