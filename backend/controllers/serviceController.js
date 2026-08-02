import Service from "../models/Service.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Get all services
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ order: 1 });

  res.json({
    success: true,
    data: services,
  });
});

// Get single service
export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.json({
    success: true,
    data: service,
  });
});

// Create service (Admin)
export const createService = asyncHandler(async (req, res) => {
  const { title, description, icon, order } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Please provide title and description" });
  }

  const service = await Service.create({
    title,
    description,
    icon,
    order: order || 0,
  });

  res.status(201).json({
    success: true,
    message: "Service created",
    data: service,
  });
});

// Update service (Admin)
export const updateService = asyncHandler(async (req, res) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Service updated",
    data: service,
  });
});

// Delete service (Admin)
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.json({
    success: true,
    message: "Service deleted",
  });
});
