import express from "express";
import {
  postJob,
  getMyJobs,
  getAllJobs,
  updateJob,
  deleteJob
} from "../controllers/job.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/", isAuthenticated, postJob);
router.get("/my", isAuthenticated, getMyJobs);
router.get("/", getAllJobs);
router.put("/:id", isAuthenticated, updateJob);
router.delete("/:id", isAuthenticated, deleteJob);

export default router;
