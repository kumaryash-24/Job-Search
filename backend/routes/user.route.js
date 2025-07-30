
import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  downloadResume,
  checkAuth
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { uploadProfile } from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", uploadProfile.single("profilePhoto"), register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getProfile);

router.put(
  "/profile/update",
  isAuthenticated,
  uploadProfile.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateProfile
);

router.get("/download-resume",isAuthenticated, downloadResume);
router.get("/check-auth",checkAuth)

export default router;
