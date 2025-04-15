const mongoose = require("mongoose");

const CameraSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ipAddress: { type: [String], required: true },
  location: { type: String },
});

module.exports = mongoose.model("Camera", CameraSchema);
