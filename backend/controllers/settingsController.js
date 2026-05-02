import Settings from "../models/Settings.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json({ success: true, data: settings });
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    settings = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
    });
  }
  res.json({ success: true, data: settings });
});
