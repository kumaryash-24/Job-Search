import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- REGISTER a new user ---
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required.", success: false });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists.", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePhoto = req.file?.path || ""; // Handle optional profile photo upload

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: { profilePhoto }
    });

    return res.status(201).json({ message: "Signup successful. Please log in.", success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error during registration.", success: false });
  }
};

// --- LOGIN an existing user ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required.", success: false });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password.", success: false });
    }

    if (!user.isActive) {
        return res.status(403).json({ message: "Your account has been deactivated. Please contact an administrator.", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password.", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

    // Prepare user object to send back (without password)
    const userResponse = { _id: user._id, fullname: user.fullname, email: user.email, phoneNumber: user.phoneNumber, role: user.role, profile: user.profile, isActive: user.isActive };
    
    return res.status(200)
      .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
      .json({ message: `Welcome back, ${user.fullname}`, user: userResponse, success: true });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", success: false });
  }
};

// --- LOGOUT a user ---
export const logout = async (req, res) => {
  try {
    return res.status(200)
      .cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'strict' })
      .json({ message: "Logged out successfully.", success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed.", success: false });
  }
};

// --- UPDATE a user's profile ---
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from our auth middleware
    
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const profilePhoto = req.files?.profilePhoto?.[0]?.path;
    const resume = req.files?.resume?.[0]?.path;
    const resumeOriginalName = req.files?.resume?.[0]?.originalname;
    
    const updatedFields = { fullname, email, phoneNumber };
    if (bio) updatedFields["profile.bio"] = bio;
    if (skills) {
      updatedFields["profile.skills"] = Array.isArray(skills) ? skills : skills.split(",").map((skill) => skill.trim());
    }
    if (profilePhoto) updatedFields["profile.profilePhoto"] = profilePhoto;
    if (resume) updatedFields["profile.resume"] = resume;
    if (resumeOriginalName) updatedFields["profile.resumeOriginalName"] = resumeOriginalName;
    
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedFields }, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ success: false, message: "Profile update failed." });
  }
};

// --- GET the logged-in user's profile ---
export const getProfile = async (req, res) => {
  try {
    // The user object is already attached to the request by the isAuthenticated middleware.
    const user = req.user; 
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Something went wrong.", success: false });
  }
};

// --- DOWNLOAD a user's resume ---
export const downloadResume = async (req, res) => {
  try {
    const resumeUrl = req.user?.profile?.resume;
    if (!resumeUrl) {
      return res.status(404).json({ message: "Resume not found for this user." });
    }
    // Redirect the browser to the Cloudinary URL to trigger the download/view.
    return res.redirect(resumeUrl); 
  } catch (error) {
    console.error("Resume download error:", error);
    return res.status(500).json({ message: "Server Error." });
  } 
};

// --- CHECK AUTH on app load ---
export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ success: false });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) { // Also check if user is still active
        return res.json({ success: false });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false });
  }
};