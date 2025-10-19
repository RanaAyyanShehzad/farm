import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "farmConnect"
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    // Don't throw error in serverless environment
  }
};
