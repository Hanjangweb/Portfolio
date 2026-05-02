import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    page: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
      default: "direct",
    },
    userAgent: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Create index for queries
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ page: 1, timestamp: -1 });

export default mongoose.model("Analytics", analyticsSchema);
