import mongoose from "mongoose";
const schema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "recruiter"], required: true },
  profile: {
    bio: String,
    skills: [String],
    resume: String,
    resumeOriginalName: String,
    profilePhoto: { type: String, default: "" }
  }
}, { timestamps: true });
export const User = mongoose.model("User", schema);
