import mongoose from "mongoose";
import dotenv from "dotenv";
import Analytics from "./models/Analytics.js";

dotenv.config();

const resetAnalytics = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const result = await Analytics.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} analytics records.`);

    process.exit(0);
  } catch (error) {
    console.error("Error resetting analytics:", error);
    process.exit(1);
  }
};

resetAnalytics();
