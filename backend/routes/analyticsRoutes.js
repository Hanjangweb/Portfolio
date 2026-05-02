import express from "express";
import {
  getAnalyticsStats,
  getVisitorTimeline,
} from "../controllers/analyticsController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", protect, authorize(['admin']), getAnalyticsStats);
router.get("/visits", protect, authorize(['admin']), getVisitorTimeline);

export default router;
