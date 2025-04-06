const express = require("express");
const router = express.Router();
const Camera = require("../models/Camera");

// Add a new camera
router.post("/", async (req, res) => {
  try {
    const { name, ipAddress, location } = req.body;
    console.log("Received data:", { name, ipAddress, location });
    const newCamera = new Camera({ name, ipAddress, location });
    await newCamera.save();
    res.status(201).json(newCamera);
  } catch (err) {
    console.error("Error saving camera:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all cameras
router.get("/", async (req, res) => {
  try {
    const cameras = await Camera.find();
    res.json(cameras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE a camera by ID
router.delete("/:id", async (req, res) => {
  try {
    const camera = await Camera.findByIdAndDelete(req.params.id);
    if (!camera) {
      return res.status(404).json({ message: "Camera not found" });
    }
    res.json({ message: "Camera deleted successfully" });
  } catch (error) {
    console.error("Error deleting camera:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
