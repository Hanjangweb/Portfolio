import FooterLink from "../models/FooterLink.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @desc    Get all footer links
// @route   GET /api/footer
// @access  Public
export const getFooterLinks = asyncHandler(async (req, res) => {
  const links = await FooterLink.find().sort({ section: 1, order: 1 });
  res.json({ success: true, data: links });
});

// @desc    Create a footer link
// @route   POST /api/footer
// @access  Private/Admin
export const createFooterLink = asyncHandler(async (req, res) => {
  const link = await FooterLink.create(req.body);
  res.status(201).json({ success: true, data: link });
});

// @desc    Update a footer link
// @route   PUT /api/footer/:id
// @access  Private/Admin
export const updateFooterLink = asyncHandler(async (req, res) => {
  let link = await FooterLink.findById(req.params.id);
  if (!link) {
    return res.status(404).json({ success: false, message: "Link not found" });
  }
  link = await FooterLink.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: link });
});

// @desc    Delete a footer link
// @route   DELETE /api/footer/:id
// @access  Private/Admin
export const deleteFooterLink = asyncHandler(async (req, res) => {
  const link = await FooterLink.findById(req.params.id);
  if (!link) {
    return res.status(404).json({ success: false, message: "Link not found" });
  }
  await link.deleteOne();
  res.json({ success: true, message: "Link removed" });
});
