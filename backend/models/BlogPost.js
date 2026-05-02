import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      default: "Admin",
    },
    tags: [String],
    published: {
      type: Boolean,
      default: false,
    },
    views: {
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

// Create slug from title before saving
blogPostSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

export default mongoose.model("BlogPost", blogPostSchema);
