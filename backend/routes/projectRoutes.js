import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", protect, authorize(['admin']), createProject);
router.put("/:id", protect, authorize(['admin']), updateProject);
router.delete("/:id", protect, authorize(['admin']), deleteProject);

export default router;
