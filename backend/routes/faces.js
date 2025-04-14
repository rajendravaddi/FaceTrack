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

// Connect to MongoDB
mongoose.connect(mongoURI);
const conn = mongoose.connection;

// Init GridFSBucket after DB connection
conn.once("open", () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: "faces" });
  console.log("Connected to MongoDB and GridFSBucket initialized!");
});

// Multer Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/faces — Upload a face image with name
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!file || !name) {
      return res.status(400).json({ error: "Missing file or name" });
    }

    const readableStream = Readable.from(file.buffer);

    const uploadStream = gfsBucket.openUploadStream(`${Date.now()}-${file.originalname}`, {
      metadata: { name },
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

// GET /api/faces — Fetch all authorized faces
router.get("/", async (req, res) => {
  try {
    const files = await conn.db.collection("faces.files").find().toArray();

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
    const downloadStream = gfsBucket.openDownloadStream(fileId);

    downloadStream.on("error", (err) => {
      console.error("Image retrieval error:", err);
      res.status(404).json({ error: "Image not found" });
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error("Error retrieving image:", err);
    res.status(500).json({ error: "Failed to retrieve image" });
  }
});

module.exports = router;
