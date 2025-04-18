const express = require("express");
const router = express.Router();
const Camera = require("../models/Camera");

// Add or update a camera for a user
router.post("/", async (req, res) => {
  try {
    const { cameraName, ipAddress, location, username } = req.body;
    console.log("Received data:", { cameraName, ipAddress, location, username });

    if (!cameraName || !ipAddress || !username) {
      return res.status(400).json({ error: "Camera name, IP address, and username are required" });
    }

    // Update if camera exists, otherwise insert
    const existing = await Camera.findOne({ username });

    if (existing) {
      existing.cameraName = cameraName;
      existing.ipAddress = ipAddress;
      existing.location = location;
      const updated = await existing.save();
      return res.status(200).json(updated);
    }

    const newCamera = new Camera({ cameraName, ipAddress, location, username });
    await newCamera.save();
    res.status(201).json(newCamera);
  } catch (err) {
    console.error("Error saving camera:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all cameras for a specific user
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const cameras = await Camera.find({ username });
    res.json(cameras);
  } catch (err) {
    console.error("Error fetching cameras:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a camera by ID and username
router.delete("/:id/:username", async (req, res) => {
  const { id, username } = req.params;

  try {
    const camera = await Camera.findOneAndDelete({ _id: id, username });

    if (!camera) {
      return res.status(404).json({ message: "Camera not found or unauthorized" });
    }

    res.json({ message: "Camera deleted successfully" });
  } catch (error) {
    console.error("Error deleting camera:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
