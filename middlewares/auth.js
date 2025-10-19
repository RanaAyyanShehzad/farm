import jwt from "jsonwebtoken";
import { farmer } from "../models/farmer.js";
import { buyer } from "../models/buyer.js";
import { supplier } from "../models/supplier.js";
import { admin } from "../models/admin.js";
import ErrorHandler from "./error.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token; // ✅ safely access cookie
    if (!token) return next(new ErrorHandler("Login First — No Token Found", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const role = decoded.role;
    let user;

    if (role === "farmer") user = await farmer.findById(decoded._id);
    else if (role === "buyer") user = await buyer.findById(decoded._id);
    else if (role === "supplier") user = await supplier.findById(decoded._id);
    else if (role === "admin") user = await admin.findById(decoded._id);

    if (!user) return next(new ErrorHandler("User not found", 404));

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
