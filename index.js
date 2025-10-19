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

import { connectDB } from "./data/database.js";
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

app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins
    return callback(null, true);
  },
  credentials: true, // Enable credentials for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
}));

// Connect to database with proper await
const initializeApp = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

// Initialize database connection
initializeApp();
// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Agro Backend API');
});

// Test route for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Test route to check token without database
app.get('/api/test-token', (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
  res.json({
    success: true,
    hasToken: !!token,
    token: token ? token.substring(0, 20) + '...' : null,
    cookies: req.cookies,
    headers: req.headers.authorization
  });
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

setupCartCleanupJob();

// Start server (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is working");
  });
}

// Export the app for Vercel
export default app;
