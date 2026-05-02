import Skill from "../models/Skill.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Get all skills
export const getSkills = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = category ? { category } : {};

  const skills = await Skill.find(query).sort({ order: 1 });

  // Group by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  res.json({
    success: true,
    data: skills,
    grouped: groupedSkills,
  });
});

// Get single skill
export const getSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }

  res.json({
    success: true,
    data: skill,
  });
});

// Create skill (Admin)
export const createSkill = asyncHandler(async (req, res) => {
  const { name, category, level, icon, description } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: "Please provide name and category" });
  }

  const skill = await Skill.create({
    name,
    category,
    level: level || 80,
    icon,
    description,
  });

  res.status(201).json({
    success: true,
    message: "Skill created",
    data: skill,
  });
});

// Update skill (Admin)
export const updateSkill = asyncHandler(async (req, res) => {
  let skill = await Skill.findById(req.params.id);

  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }

  skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Skill updated",
    data: skill,
  });
});

// Delete skill (Admin)
export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);

  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }

  res.json({
    success: true,
    message: "Skill deleted",
  });
});
