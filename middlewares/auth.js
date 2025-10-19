import jwt from "jsonwebtoken";
import { farmer } from "../models/farmer.js"
import ErrorHandler from "./error.js";
import { buyer } from "../models/buyer.js";
import { supplier } from "../models/supplier.js";
import { admin } from "../models/admin.js";
export const isAuthenticated = async (req, res, next) => {
    try {
        // Debug logging
        console.log('Auth middleware - Cookies:', req.cookies);
        console.log('Auth middleware - Headers:', req.headers.authorization);
        
        const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
        console.log('Auth middleware - Token found:', !!token);
        
        if (!token) {
            console.log('Auth middleware - No token found');
            return next(new ErrorHandler("Login First", 404));
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware - Token decoded:', decoded);
        
        const role = decoded.role;
        if(role=="farmer"){
            req.user = await farmer.findById(decoded._id);
        }else if(role=="buyer"){
            req.user = await buyer.findById(decoded._id);
        }else if(role=="supplier"){
            req.user = await supplier.findById(decoded._id);
        }else if(role=="admin"){
            req.user= await admin.findById(decoded._id);
        } 
        
        console.log('Auth middleware - User found:', !!req.user);
        next();
    } catch (error) {
        console.log('Auth middleware - Error:', error.message);
        next(error);
    }
}
