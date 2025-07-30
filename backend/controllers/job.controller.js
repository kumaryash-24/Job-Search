import { Job } from "../models/job.model.js";

// This controller now consistently uses req.user._id, which is provided by your auth middleware.

export const postJob = async (req, res) => {
  try {
    const { title, description, location, salary } = req.body;

    if (!title || !description || !location || !salary) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // ---> FIX: Use req.user._id instead of req.id <---
    const job = await Job.create({
      title,
      description,
      location,
      salary,
      postedBy: req.user._id 
    });

    return res.status(201).json({ success: true, message: "Job posted successfully", job });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to post job" });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    // ---> FIX: Use req.user._id instead of req.id <---
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 }); 
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to retrieve jobs" });
  }
};

export const updateJob = async (req, res) => { 
  try {
    const { title, description, location, salary } = req.body;
    const jobId = req.params.id;

    // ---> FIX: Use req.user._id instead of req.id <---
    const job = await Job.findOneAndUpdate(
        { _id: jobId, postedBy: req.user._id },
        { title, description, location, salary },
        { new: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or you are not the owner." });
    }

    return res.status(200).json({ success: true, message: "Job updated", job });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Update failed" });
  }
};

export const deleteJob = async (req, res) => {
  try { 
    const jobId = req.params.id;
    // ---> FIX: Use req.user._id instead of req.id <---
    const job = await Job.findOneAndDelete({ _id: jobId, postedBy: req.user._id });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or you are not the owner." });
    }

    return res.status(200).json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Deletion failed" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "fullname email");
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to load jobs" });
  }
};