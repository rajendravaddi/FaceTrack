// routes/cameras.js
const express = require("express");
const router = express.Router();
const Camera = require("../models/Camera");

// POST /api/cameras/add - Add or update the one allowed camera per user
router.post("/add", async (req, res) => {
  const { username, cameraName, ipAddresses, location } = req.body;

  if (!username || !cameraName || !ipAddresses || !Array.isArray(ipAddresses)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedCamera = await Camera.findOneAndUpdate(
      { username }, // only one camera per username
      { $set: { cameraName, ipAddresses, location } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Camera added or updated successfully", data: updatedCamera });
  } catch (err) {
    res.status(500).json({ message: "Error adding/updating camera", error: err.message });
  }
});

// GET /api/cameras/:username - Get the single camera for a user
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const camera = await Camera.findOne({ username });
    if (!camera) {
      return res.status(404).json({ message: "No camera found for this user" });
    }

    res.status(200).json(camera);
  } catch (err) {
    res.status(500).json({ message: "Error fetching camera", error: err.message });
  }
});

// DELETE /api/cameras/:id - Delete the user's single camera by ID
router.delete("/:id", async (req, res) => {
  try {
    await Camera.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Camera deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting camera", error: err.message });
  }
});

module.exports = router;
