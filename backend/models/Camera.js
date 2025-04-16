// models/Camera.js
const mongoose = require("mongoose");

const cameraSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // One camera per user
  cameraName: { type: String, required: true },
  ipAddresses: [{ type: String }],
  location: { type: String }
});

module.exports = mongoose.model("Camera", cameraSchema);
