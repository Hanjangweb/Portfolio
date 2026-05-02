import Project from "../models/Project.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Get all projects
export const getProjects = asyncHandler(async (req, res) => {
  const { featured } = req.query;
  const query = featured ? { featured: true } : {};
  
  const projects = await Project.find(query).sort({ date: -1 });
  
  res.json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

// Get single project
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json({
    success: true,
    data: project,
  });
});

// Create project (Admin)
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, image, technologies, link, github, featured } = req.body;

  if (!title || !description || !image) {
    return res.status(400).json({ message: "Please provide required fields" });
  }

  const project = await Project.create({
    title,
    description,
    image,
    technologies: technologies || [],
    link,
    github,
    featured: featured || false,
  });

  res.status(201).json({
    success: true,
    message: "Project created",
    data: project,
  });
});

// Update project (Admin)
export const updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Project updated",
    data: project,
  });
});

// Delete project (Admin)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json({
    success: true,
    message: "Project deleted",
  });
});
