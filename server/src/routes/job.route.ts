import express from "express";
import { createJob, getJobs, getJob, updateJob, deleteJob, applyForJob } from "../controllers/job.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/:id", getJob);

// Protected routes
router.post("/", authenticateToken, createJob);
router.put("/:id", authenticateToken, updateJob);
router.delete("/:id", authenticateToken, deleteJob);
router.post("/:id/apply", authenticateToken, applyForJob);

export default router;
