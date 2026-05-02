import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import { errorHandler, asyncHandler } from "./middleware/errorHandler.js";
import { trackPageView } from "./middleware/analytics.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import footerRoutes from "./routes/footerRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
connectDB();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowed.some(o => origin.startsWith(o)) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Analytics tracking middleware
app.use(trackPageView);

// Root route — shows API is alive
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio API is running 🚀",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ai", aiRoutes);

// Static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
