import express from "express";
import {
  registerEmployer,
  getEmployerProfile,
  updateEmployerProfile,
  getJobApplications,
  getAllJobsWithApplicationCounts,
} from "../controllers/employer.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

// Public route
router.post("/register", registerEmployer);

// Protected routes
router.get("/profile", authenticateToken, getEmployerProfile);
router.put("/profile", authenticateToken, updateEmployerProfile);
router.get("/jobs/:jobId/applications", authenticateToken, getJobApplications);
router.get("/jobs/count", authenticateToken, getAllJobsWithApplicationCounts);

export default router;
