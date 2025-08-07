import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";             
import userRoutes from './routes/user.route.js';
import jobRoutes from "./routes/job.routes.js";
import adminRoutes from "./routes/admin.routes.js";             
import applicationRoutes from "./routes/application.route.js";             
                           
dotenv.config();
const app = express();

// Middleware setup
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/application", applicationRoutes);

// Database Connection and Server Start
connectDB().then(() => {
  app.listen(process.env.PORT || 8000, () =>
    console.log(`✅ Server running on port ${process.env.PORT}`)
  );
});
