// backend/middleware/uploadMiddleware.js

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Profile and Resume Upload Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = file.fieldname === "profilePhoto" ? "jobPortal/profile" : "jobPortal/resume";
    return {
      folder,
      resource_type: file.mimetype.startsWith("image") ? "image" : "raw",
      public_id: `${Date.now()}-${file.originalname}`
    };
  }
});

export const uploadProfile = multer({ storage });
