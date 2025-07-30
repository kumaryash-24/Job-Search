import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.js';
import { 
    getDashboardStats, 
    getAllUsers, 
    getAllJobs,
    deleteUser,
    deleteJob,
    toggleUserStatus,
    toggleJobStatus
} from '../controllers/admin.controller.js';

const router = express.Router();
router.use(isAuthenticated, isAdmin);

// GET Routes
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/jobs', getAllJobs);

// DELETE Routes
router.delete('/users/:id', deleteUser);
router.delete('/jobs/:id', deleteJob);

// PUT Routes for toggling status
router.put('/users/:id/toggle-status', toggleUserStatus);
router.put('/jobs/:id/toggle-status', toggleJobStatus);

export default router;