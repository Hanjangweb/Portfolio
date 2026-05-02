import express from "express";
import { getFooterLinks, createFooterLink, updateFooterLink, deleteFooterLink } from "../controllers/footerController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getFooterLinks);
router.post("/", protect, authorize(['admin']), createFooterLink);
router.put("/:id", protect, authorize(['admin']), updateFooterLink);
router.delete("/:id", protect, authorize(['admin']), deleteFooterLink);

export default router;
