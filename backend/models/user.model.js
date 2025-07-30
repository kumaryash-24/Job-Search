import mongoose from "mongoose";

const schema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: Number, required: true },
  password: { type: String, required: true, select: false }, // Corrected for security
  role: { type: String, enum: ["student", "recruiter", "admin"], default: "student" },
  isActive: { // Field to control if a user can log in
    type: Boolean,
    default: true
  },
  profile: {
    bio: String,
    skills: [String],
    resume: String,
    resumeOriginalName: String,
    profilePhoto: { type: String, default: "" }
  }
}, { timestamps: true });

export const User = mongoose.model("User", schema);


