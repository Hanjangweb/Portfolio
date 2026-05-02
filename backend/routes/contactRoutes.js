import express from "express";
import {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  replyContact,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", submitContact);
router.get("/", protect, authorize(['admin']), getContacts);
router.get("/:id", protect, authorize(['admin']), getContact);
router.put("/:id", protect, authorize(['admin']), updateContact);
router.delete("/:id", protect, authorize(['admin']), deleteContact);
router.post("/:id/reply", protect, authorize(['admin']), replyContact);

export default router;