// import express from "express";
// import {
//   register,
//   login,
//   logout,
//   getProfile,
//   updateProfile
// } from "../controllers/user.controller.js";
// import { isAuthenticated } from "../middlewares/auth.js";
// import { upload } from "../middlewares/upload.js";

// const router = express.Router();

// router.post("/register", upload.single("profilePhoto"), register);
// router.post("/login", login);
// router.get("/logout", logout);
// router.get("/me", isAuthenticated, getProfile);
// // router.post("/profile/update", isAuthenticated, updateProfile);
// router.put(
//   "/profile/update",
//   upload.fields([
//     { name: "profilePhoto", maxCount: 1 },
//     { name: "resume", maxCount: 1 }
//   ]),
//   // authMiddleware, // if you want to secure this
//   updateProfile
// );

// export default router;










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
import { isAuthenticated,protect } from "../middlewares/auth.js";
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
