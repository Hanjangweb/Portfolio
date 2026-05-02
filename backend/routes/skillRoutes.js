import express from "express";
import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getSkills);
router.get("/:id", getSkill);
router.post("/", protect, authorize(['admin']), createSkill);
router.put("/:id", protect, authorize(['admin']), updateSkill);
router.delete("/:id", protect, authorize(['admin']), deleteSkill);

export default router;
