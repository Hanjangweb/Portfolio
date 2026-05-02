import mongoose from "mongoose";

const footerLinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
      enum: ['Quick Links', 'Resources', 'Follow'],
      default: 'Quick Links',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FooterLink", footerLinkSchema);
