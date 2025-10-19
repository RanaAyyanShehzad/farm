import express from "express";
import adminRoutes from "./routes/admin.js";
import farmerRoutes from "./routes/farmer.js";
import orderRoutes from "./routes/order.js";
import buyerRoutes from "./routes/buyer.js";
import supplierRoutes from "./routes/supplier.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";
import reviewRoutes from "./routes/review.js";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";

import { connectDB, isDBConnected } from "./data/database.js";
import { setupCartCleanupJob } from './jobs/cartCleanup.js';

import weatherRoutes from "./routes/weatherRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

// Initialize Express app
const app = express();

// Load environment variables
config({
    path: "./data/config.env",
});

// Middlewares
app.use(express.json());
app.use(cookieParser());

let allowedOrigins = process.env.ALLOWED_ORIGINS;

if (allowedOrigins) {
  allowedOrigins = allowedOrigins.split(',');
} else {
  allowedOrigins = ['http://localhost:3000']; // or your default origin(s)
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins for now, or specify your frontend URL
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Agro Backend API');
});
app.use("/api/weather", weatherRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/review",reviewRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Database connection and cart cleanup setup
connectDB();
setupCartCleanupJob();

// Start server (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is working");
  });
}

// Export the app for Vercel
export default app;
