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

// Connect to MongoDB and init GridFSBucket
mongoose.connect(mongoURI);
const conn = mongoose.connection;

conn.once("open", () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: "faces" });
  console.log("Connected to MongoDB and GridFSBucket initialized!");
});

// Use multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * POST /api/faces
 * Upload up to 4 face images for an authorized member
 */
router.post("/", upload.array("images", 4), async (req, res) => {
  try {
    const { name, username } = req.body;
    const files = req.files;

    if (!files || files.length === 0 || !name || !username) {
      return res.status(400).json({ error: "Missing images, name, or username" });
    }

    // Prevent duplicate (same name + username)
    // const existing = await conn.db.collection("faces.files").findOne({
    //   "metadata.name": name,
    //   "metadata.username": username,
    // });

    // if (existing) {
    //   return res.status(409).json({ error: `Face with name "${name}" already exists for this user.` });
    // }

    // Upload each image into GridFS
    const uploadedIds = [];

    for (const file of files) {
      const readableStream = Readable.from(file.buffer);

      const uploadStream = gfsBucket.openUploadStream(`${Date.now()}-${file.originalname}`, {
        contentType: file.mimetype,
        metadata: { name, username },
      });

      await new Promise((resolve, reject) => {
        readableStream.pipe(uploadStream);
        uploadStream.on("error", reject);
        uploadStream.on("finish", () => {
          uploadedIds.push(uploadStream.id);
          resolve();
        });
      });
    }

    res.status(200).json({
      message: "Authorized member added successfully!",
      fileIds: uploadedIds,
      name,
      username,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/faces
 * Return grouped face entries per user (each with up to 4 images)
 */
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

    const grouped = {};

    files.forEach((file) => {
      const name = file.metadata?.name || "Unknown";
      const memberId = `${file.metadata.username}__${name}`;
      const id = file._id;

      if (!grouped[memberId]) {
        grouped[memberId] = {
          _id: memberId,
          name,
          username: file.metadata.username,
          images: [],
        };
      }

      grouped[memberId].images.push({
        _id: id,
        imageUrl: `/api/faces/image/${id}`,
      });
    });

    res.status(200).json(Object.values(grouped));
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch faces" });
  }
});

/**
 * GET /api/faces/image/:id
 * Stream one face image by ID
 */
router.get("/image/:id", async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);

    const fileDoc = await conn.db.collection("faces.files").findOne({ _id: fileId });
    if (!fileDoc) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", fileDoc.contentType || "image/jpeg");
    const stream = gfsBucket.openDownloadStream(fileId);
    stream.pipe(res);
  } catch (err) {
    console.error("Image fetch error:", err);
    res.status(500).json({ error: "Failed to retrieve image" });
  }
});

/**
 * DELETE /api/faces/:memberId
 * Remove all face images of a specific member
 */
router.delete("/:memberId", async (req, res) => {
  try {
    const [username, name] = req.params.memberId.split("__");
    if (!username || !name) {
      return res.status(400).json({ error: "Invalid member identifier" });
    }

    const files = await conn.db
      .collection("faces.files")
      .find({ "metadata.name": name, "metadata.username": username })
      .toArray();

    if (!files.length) {
      return res.status(404).json({ error: "No images found for this member." });
    }

    const deleteOps = files.map(async (file) => {
      await conn.db.collection("faces.files").deleteOne({ _id: file._id });
      await conn.db.collection("faces.chunks").deleteMany({ files_id: file._id });
    });

    await Promise.all(deleteOps);

    res.status(200).json({ message: "All images for member deleted successfully!" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete face images" });
  }
});

module.exports = router;
