import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// This is the new, unified authentication middleware for your entire app.
export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        // Use SECRET_KEY, as this is what your login controller uses to sign the token.
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Invalid token." });
        }

        // Find the user and attach the full user object (without password) to the request.
        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ success: false, message: "Authentication failed." });
    }
};

// This middleware for checking admin role remains the same.
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Admin access required."
        });
    }
};