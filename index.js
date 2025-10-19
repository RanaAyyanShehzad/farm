import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDB } from "./data/database.js";
import { setupCartCleanupJob } from "./jobs/cartCleanup.js";
import { errorMiddleware } from "./middlewares/error.js";

// Routes
import adminRoutes from "./routes/admin.js";
import farmerRoutes from "./routes/farmer.js";
import orderRoutes from "./routes/order.js";
import buyerRoutes from "./routes/buyer.js";
import supplierRoutes from "./routes/supplier.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";
import reviewRoutes from "./routes/review.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

// Initialize app
const app = express();

// Load .env
config({ path: "./data/config.env" });

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Configure CORS dynamically from .env
let allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser tools
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // ✅ allow cookies across origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ Connect to database
connectDB();
setupCartCleanupJob();

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Welcome to the Agro Backend API");
});

app.get("/api/test-token", (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
  res.json({
    success: true,
    hasToken: !!token,
    cookies: req.cookies,
    token: token ? token.substring(0, 30) + "..." : null,
  });
});

// ✅ All routes
app.use("/api/weather", weatherRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/buyers", buyerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/chatbot", chatbotRoutes);

// ✅ Error handling
app.use(errorMiddleware);

// ✅ Local dev mode
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
}

// ✅ Export for Vercel
export default app;
