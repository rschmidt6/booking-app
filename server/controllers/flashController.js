// server/controllers/flashController.js
import { db } from "../db.js";
import cloudinary from "cloudinary";
import multer from "multer";
import { env } from "../config/env.js";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const getFlashImages = (req, res) => {
  try {
    const images = db
      .prepare("SELECT * FROM flash_images ORDER BY created_at DESC")
      .all();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadImage = [
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Convert file to base64
      const fileStr = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${fileStr}`;

      // Upload to Cloudinary
      const uploadResponse = await cloudinary.v2.uploader.upload(dataURI, {
        folder: "flash",
      });

      // Save to database
      const dbResult = db
        .prepare(
          `
        INSERT INTO flash_images (url, public_id)
        VALUES (?, ?)
      `
        )
        .run(uploadResponse.secure_url, uploadResponse.public_id);

      res.status(201).json({
        id: dbResult.lastInsertRowid,
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Get image details from database
    const image = db.prepare("SELECT * FROM flash_images WHERE id = ?").get(id);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete from Cloudinary
    await cloudinary.v2.uploader.destroy(image.public_id);

    // Delete from database
    db.prepare("DELETE FROM flash_images WHERE id = ?").run(id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
