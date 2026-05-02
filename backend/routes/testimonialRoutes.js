import express from "express";
import {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getTestimonials);
router.get("/:id", getTestimonial);
router.post("/", createTestimonial);
router.put("/:id", protect, authorize(['admin']), updateTestimonial);
router.delete("/:id", protect, authorize(['admin']), deleteTestimonial);

export default router;
