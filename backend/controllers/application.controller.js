import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Apply for a job
export const applyForJob = async (req, res) => {
    try {
        const userId = req.user._id;
        const jobId = req.params.id;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ success: false, message: "Job not found." });

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) return res.status(400).json({ success: false, message: "You have already applied for this job." });

        const newApplication = await Application.create({ job: jobId, applicant: userId, recruiter: job.postedBy });
        job.applications.push(newApplication._id);
        await job.save();

        res.status(201).json({ success: true, message: "Application submitted successfully.", application: newApplication });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Get all applications for the logged-in student
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id }).populate({ path: 'job', select: 'title location' });
        res.status(200).json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch applications." });
    }
};

// Get all applications for the logged-in recruiter's jobs
export const getRecruiterApplications = async (req, res) => {
    try {
        const applications = await Application.find({ recruiter: req.user._id }).populate({ path: 'applicant', select: 'fullname email profile' }).populate({ path: 'job', select: 'title' });
        res.status(200).json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch applications." });
    }
};

// Update an application's status (approve/reject)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ success: false, message: "Invalid status." });

        const application = await Application.findById(applicationId);
        if (!application || application.recruiter.toString() !== req.user._id.toString()) {
            return res.status(404).json({ success: false, message: "Application not found or you are not authorized." });
        }

        application.status = status;
        await application.save();

        res.status(200).json({ success: true, message: `Application ${status}.`, application });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};