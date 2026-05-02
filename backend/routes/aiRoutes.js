import express from "express";
import { generateContent } from "../controllers/aiController.js";

const router = express.Router();

// AI generation available to all users (no auth required)
router.post("/generate", generateContent);

export default router;
