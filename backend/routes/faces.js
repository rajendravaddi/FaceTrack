const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFSBucket, ObjectId } = require("mongodb");
const { Readable } = require("stream");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

const mongoURI = process.env.MONGO_URI;
let gfsBucket;

mongoose.connect(mongoURI);
const conn = mongoose.connection;

conn.once("open", () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: "faces" });
  console.log("Connected to MongoDB and GridFSBucket initialized!");
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ POST /api/faces — Upload with uniqueness check
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, username } = req.body;
    const file = req.file;

    if (!file || !name || !username) {
      return res.status(400).json({ error: "Missing file, name, or username" });
    }

    // ✅ Check for existing face with same name and username
    const existingFace = await conn.db.collection("faces.files").findOne({
      "metadata.name": name,
      "metadata.username": username,
    });

    if (existingFace) {
      return res.status(409).json({
        error: `Face with name "${name}" already exists for this user.`,
      });
    }

    const readableStream = Readable.from(file.buffer);

    const uploadStream = gfsBucket.openUploadStream(`${Date.now()}-${file.originalname}`, {
      contentType: file.mimetype,
      metadata: { name, username },
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("error", (err) => {
      console.error("Upload Error:", err);
      res.status(500).json({ error: "Error uploading file to GridFS" });
    });

    uploadStream.on("finish", () => {
      console.log("File uploaded to GridFS:", uploadStream.id);
      res.status(200).json({
        message: "Authorized face uploaded to MongoDB!",
        fileId: uploadStream.id,
        name,
      });
    });
  } catch (err) {
    console.error("Upload Exception:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/faces — Fetch all authorized faces by username
router.get("/", async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Missing username" });
    }

    const files = await conn.db
      .collection("faces.files")
      .find({ "metadata.username": username })
      .toArray();

    const faces = files.map((file) => ({
      _id: file._id,
      name: file.metadata?.name || "Unknown",
      imageUrl: `/api/faces/image/${file._id}`,
    }));

    res.status(200).json(faces);
  } catch (error) {
    console.error("Error fetching faces:", error);
    res.status(500).json({ error: "Failed to fetch faces" });
  }
});

// GET /api/faces/image/:id — Serve the actual image
router.get("/image/:id", async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    console.log("Fetching image with ID:", fileId);

    const fileDoc = await conn.db.collection("faces.files").findOne({ _id: fileId });
    if (!fileDoc) {
      console.error("Image not found in GridFS!");
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", fileDoc.contentType || "image/jpeg");

    const downloadStream = gfsBucket.openDownloadStream(fileId);

    downloadStream.on("error", (err) => {
      console.error("Error streaming image:", err);
      res.status(500).json({ error: "Error streaming image" });
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error("Exception in /image/:id route:", err);
    res.status(500).json({ error: "Failed to retrieve image" });
  }
});

// DELETE /api/faces/:id — Remove a face image from GridFS
router.delete("/:id", async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);

    await conn.db.collection("faces.files").deleteOne({ _id: fileId });
    await conn.db.collection("faces.chunks").deleteMany({ files_id: fileId });

    res.status(200).json({ message: "Face image deleted successfully!" });
  } catch (error) {
    console.error("Error deleting face:", error);
    res.status(500).json({ error: "Failed to delete face image" });
  }
});

module.exports = router;
