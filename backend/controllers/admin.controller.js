import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js'; 
import { Application } from "../models/application.model.js";

// --- GET ENHANCED DASHBOARD STATS ---
export const getDashboardStats = async (req, res) => {
    try {
        // Calculate total non-admin users and total jobs
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const totalJobs = await Job.countDocuments();
        
        // Find the 5 most recent signups
        const recentSignups = await User.find({ role: { $ne: 'admin' } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('fullname email createdAt');

        res.status(200).json({ 
            success: true, 
            stats: { totalUsers, totalJobs },
            recentSignups
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ success: false, message: 'Server Error fetching stats' });
    }
};

// --- GET ALL USERS (for the Admin > Manage Users page) ---
export const getAllUsers = async (req, res) => {
    try {
        // Exclude the currently logged-in admin from the list
        const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ success: false, message: 'Server Error fetching users' });
    }
};

// --- GET ALL JOBS (for the Admin > Manage Jobs page) ---
export const getAllJobs = async (req, res) => {
    try {
        // Populate the 'postedBy' field to show the recruiter's name
        const jobs = await Job.find({}).populate('postedBy', 'fullname');
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error("Get All Jobs Error:", error);
        res.status(500).json({ success: false, message: 'Server Error fetching jobs' });
    }
};

// --- TOGGLE a user's active status (Activate/Deactivate) ---
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.role === 'admin') return res.status(403).json({ success: false, message: "Cannot change status of an admin." });

        // Flip the boolean status
        user.isActive = !user.isActive;
        await user.save();
        
        res.status(200).json({ success: true, message: `User status updated successfully.`, user });
    } catch (error) {
        console.error("Toggle User Status Error:", error);
        res.status(500).json({ success: false, message: "Failed to update user status." });
    }
};

// --- TOGGLE a job's active status (Activate/Deactivate) ---
export const toggleJobStatus = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        // Flip the status between 'active' and 'inactive'
        job.status = job.status === 'active' ? 'inactive' : 'active';
        await job.save();

        res.status(200).json({ success: true, message: `Job status updated successfully.`, job });
    } catch (error) {
        console.error("Toggle Job Status Error:", error);
        res.status(500).json({ success: false, message: "Failed to update job status." });
    }
};

// --- DELETE a user (and their applications) ---
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Admins cannot be deleted.' });
        }

        // Cascading Delete: First, delete all applications submitted by this user.
        await Application.deleteMany({ applicant: userId });
        
        // (Optional) Consider what to do if the deleted user is a recruiter. 
        // For now, their jobs will remain but have no poster.

        // Finally, delete the user themselves.
        await User.findByIdAndDelete(userId);

        res.status(200).json({ success: true, message: 'User and all their applications have been deleted.' });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ success: false, message: 'Server Error deleting user' });
    }
};

// --- DELETE a job (and its applications) ---
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Cascading Delete: First, delete all applications associated with this job.
        await Application.deleteMany({ job: jobId });
        
        // Then, delete the job itself.
        await Job.findByIdAndDelete(jobId);

        res.status(200).json({ success: true, message: 'Job and all associated applications deleted.' });
    } catch (error) {
        console.error("Delete Job Error:", error);
        res.status(500).json({ success: false, message: 'Server Error deleting job' });
    }
};