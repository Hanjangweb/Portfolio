import Testimonial from "../models/Testimonial.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Get all testimonials
export const getTestimonials = asyncHandler(async (req, res) => {
  const { featured } = req.query;
  const query = featured ? { featured: true } : {};

  const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: testimonials.length,
    data: testimonials,
  });
});

// Get single testimonial
export const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({ message: "Testimonial not found" });
  }

  res.json({
    success: true,
    data: testimonial,
  });
});

// Create testimonial (Admin)
export const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, message, image, rating, featured } = req.body;

  if (!name || !role || !message) {
    return res.status(400).json({ message: "Please provide required fields (name, role, message)" });
  }

  const testimonial = await Testimonial.create({
    name,
    role,
    message,
    image,
    rating: rating || 5,
    featured: featured || false,
  });

  res.status(201).json({
    success: true,
    message: "Testimonial created",
    data: testimonial,
  });
});

// Update testimonial (Admin)
export const updateTestimonial = asyncHandler(async (req, res) => {
  let testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({ message: "Testimonial not found" });
  }

  testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Testimonial updated",
    data: testimonial,
  });
});

// Delete testimonial (Admin)
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

  if (!testimonial) {
    return res.status(404).json({ message: "Testimonial not found" });
  }

  res.json({
    success: true,
    message: "Testimonial deleted",
  });
});
