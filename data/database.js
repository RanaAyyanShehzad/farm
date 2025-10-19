import mongoose from "mongoose";

// Connection state tracking
let isConnected = false;

export const connectDB = async () => {
  // Return existing connection if already connected
  if (isConnected) {
    console.log("Database already connected");
    return;
  }

  try {
    // Close any existing connections first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "farmConnect",
      // Serverless optimizations
      maxPoolSize: 1, // Maintain only 1 connection in serverless
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
      // Connection options for serverless
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
    });

    isConnected = true;
    console.log("Database connected successfully");

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
      isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
      isConnected = false;
    });

  } catch (error) {
    console.error("Database connection failed:", error);
    isConnected = false;
    // Don't throw error in serverless environment
  }
};

// Function to check if database is connected
export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};
