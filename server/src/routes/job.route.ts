import express from "express";
import { createJob, getJobs, getJob, updateJob, deleteJob, applyForJob } from "../controllers/job.controller";
import { authenticateToken, authenticateEmployer } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", authenticateToken, getJobs);
router.get("/:id", authenticateToken, getJob);

// Protected routes
router.post("/", authenticateEmployer, createJob);
router.put("/:id", authenticateEmployer, updateJob);
router.delete("/:id", authenticateEmployer, deleteJob);
router.post("/:id/apply", authenticateEmployer, applyForJob);

export default router;
