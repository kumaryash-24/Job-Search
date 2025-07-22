import { Job } from "../models/job.model.js";

// Create a new job
export const postJob = async (req, res) => {
  try {
    const { title, description, location, salary } = req.body;

    if (!title || !description || !location || !salary) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      postedBy: req.id
    });

    return res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to post job"
    });
  }
};

// Get jobs posted by the current user
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve jobs"
    });
  }
};

// Update a job
export const updateJob = async (req, res) => {
  try {
    const { title, description, location, salary } = req.body;
    const jobId = req.params.id;

    const job = await Job.findOne({ _id: jobId, postedBy: req.id });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    job.title = title;
    job.description = description;
    job.location = location;
    job.salary = salary;
    await job.save();

    return res.status(200).json({ success: true, message: "Job updated", job });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Update failed" });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findOneAndDelete({ _id: jobId, postedBy: req.id });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
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

    return res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load jobs"
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.id,
      { fullname, email, phoneNumber },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user: updatedUser
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Update failed" });
  }
};