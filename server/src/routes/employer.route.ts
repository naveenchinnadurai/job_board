import express from "express";
import { registerEmployer, getEmployerProfile, updateEmployerProfile, getJobApplications, getAllJobsWithApplicationCounts, } from "../controllers/employer.controller";
import { authenticateEmployer } from "../middleware/auth.middleware";

const router = express.Router();

// Public route
router.post("/register", registerEmployer);

// Protected routes
router.get("/profile", authenticateEmployer, getEmployerProfile);
router.put("/profile", authenticateEmployer, updateEmployerProfile);
router.get("/jobs/:jobId/applications", authenticateEmployer, getJobApplications);
router.get("/jobs/count", authenticateEmployer, getAllJobsWithApplicationCounts);

export default router;
