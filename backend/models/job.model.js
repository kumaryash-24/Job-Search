import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  salary: Number,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  status: { // Field to control if a job is visible
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);