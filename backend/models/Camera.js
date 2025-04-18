const mongoose = require("mongoose");

const CameraSchema = new mongoose.Schema({
  cameraName: { type: String, required: true },
  ipAddress: { type: String, required: true },
  location: { type: String },
  username: { type: String, required: true },
});

module.exports = mongoose.model("Camera", CameraSchema);

