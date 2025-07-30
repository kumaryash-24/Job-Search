import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { 
    applyForJob, 
    getMyApplications, 
    getRecruiterApplications, 
    updateApplicationStatus 
} from "../controllers/application.controller.js";

const router = express.Router();

// All routes require a logged-in user
router.use(isAuthenticated);

// Student routes
router.post('/apply/:id', applyForJob); // Apply for a job with a specific ID
router.get('/my', getMyApplications); // Get all applications for the logged-in student

// Recruiter routes
router.get('/recruiter', getRecruiterApplications); // Get all applications for the logged-in recruiter
router.put('/update/:id', updateApplicationStatus); // Update an application with a specific ID

export default router;



// import express from "express";
// import { isAuthenticated } from "../middlewares/auth.js";
// import { applyForJob, getMyApplications, getRecruiterApplications, updateApplicationStatus } from "../controllers/application.controller.js";
// const router = express.Router();
// router.use(isAuthenticated);
// // Student Routes
// router.post('/apply/:id', applyForJob);
// router.get('/my', getMyApplications);
// // Recruiter Routes
// router.get('/recruiter', getRecruiterApplications);
// router.put('/update/:id', updateApplicationStatus);
// export default router;