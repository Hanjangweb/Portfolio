import User from "../models/User.js";
import { generateToken } from "../utils/helpers.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// User Registration
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!email || !password || !name) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  // Check if user exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create user
  user = await User.create({
    name,
    email,
    password,
    role: "user",
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: user.toJSON(),
  });
});

// User Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id, user.role);

  res.json({
    success: true,
    message: "Login successful",
    token,
    user: user.toJSON(),
  });
});

// User Logout
export const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// Get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    success: true,
    user: user.toJSON(),
  });
});
