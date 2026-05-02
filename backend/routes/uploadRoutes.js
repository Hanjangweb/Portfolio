import express from "express";
import upload from "../middleware/upload.js";
import { protect, authorize } from "../middleware/auth.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Upload image
router.post("/", protect, authorize(['admin']), upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload a file" });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer, "portfolio/images");
    res.json({
      success: true,
      data: result.secure_url
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

// Upload resume (PDF)
router.post("/resume", protect, authorize(['admin']), upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload a PDF file" });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer, "portfolio/resumes", "raw");
    res.json({
      success: true,
      data: result.secure_url,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error("Cloudinary resume upload error:", error);
    res.status(500).json({ success: false, message: "Resume upload failed" });
  }
});

export default router;
