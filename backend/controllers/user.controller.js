import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "Missing fields", success: false });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePhoto = req.file?.path || "";

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: { profilePhoto }
    });

    return res.status(201).json({ message: "Signup successful", success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal error", success: false });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing credentials", success: false });
    }

    let user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)) || role !== user.role) {
      return res.status(400).json({ message: "Invalid credentials or role", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    };
// console.log("User logged in:", user._id);
    return res.status(200)
      .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
      .json({ message: `Welcome back ${user.fullname}`, user, success: true });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully.", success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed", success: false });
  }
};


// import User from "../models/User.js";

// import { User } from "../models/User.js"; // adjust path if needed

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      // console.log("❌ User ID not found in request");
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const profilePhoto = req.files?.profilePhoto?.[0]?.path;
    const resume = req.files?.resume?.[0]?.path;
    const resumeOriginalName = req.files?.resume?.[0]?.originalname;

    // console.log("📦 Received data:", { fullname, email, phoneNumber, bio, skills });
    // console.log("🖼️ Uploaded files:", { profilePhoto, resume, resumeOriginalName });

    // Prepare fields to update
    const updatedFields = {
      fullname,
      email,
      phoneNumber,
    };

    // Update nested profile fields
    if (bio) updatedFields["profile.bio"] = bio;
    if (skills) {
      updatedFields["profile.skills"] = Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => skill.trim());
    }
    if (profilePhoto) updatedFields["profile.profilePhoto"] = profilePhoto;
    if (resume) updatedFields["profile.resume"] = resume;
    if (resumeOriginalName) updatedFields["profile.resumeOriginalName"] = resumeOriginalName;

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      console.log("❌ No user found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("✅ Profile updated for user:", updatedUser._id);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Update Profile Error:", err);
    return res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};




export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    console.log("Profile fetched for:", user._id);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};




export const downloadResume = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    console.log("User found for resume download:", userId);
    const resumeUrl = user?.profile?.resume;
    console.log("Resume URL:", resumeUrl);

    if (!user || !user?.profile?.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.redirect(resumeUrl); // Redirect to the Cloudinary resume URL
  } catch (error) {
    console.error("❌ Resume download error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};



export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.json({ success: false });

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false });
  }
};


