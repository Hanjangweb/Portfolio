import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    technologies: [{
      type: String,
      required: true,
    }],
    link: {
      type: String,
      required: false,
    },
    github: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: 'web',
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
