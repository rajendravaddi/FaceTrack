const mongoose = require("mongoose");

const AuthorizedFaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model("AuthorizedFace", AuthorizedFaceSchema);
