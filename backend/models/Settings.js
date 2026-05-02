import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: "contact@example.com",
    },
    phone: {
      type: String,
      default: "+1 234 567 890",
    },
    address: {
      type: String,
      default: "123 Street Name, City, Country",
    },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
    siteName: {
      type: String,
      default: "Portfolio",
    },
    footerText: {
      type: String,
      default: "Full-stack developer passionate about creating amazing digital experiences.",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
