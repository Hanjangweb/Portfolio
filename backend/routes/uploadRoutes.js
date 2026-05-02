import express from "express";
import upload from "../middleware/upload.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Upload image
router.post("/", protect, authorize(['admin']), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload a file" });
  }

  const url = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    data: url
  });
});

// Upload resume (PDF)
router.post("/resume", protect, authorize(['admin']), upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload a PDF file" });
  }

  const url = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    data: url,
    filename: req.file.originalname
  });
});

export default router;
