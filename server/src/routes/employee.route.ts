import express from "express";
import { registerEmployee, getEmployeeProfile, updateEmployeeProfile, } from "../controllers/employee.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

// Public route
router.post("/register", registerEmployee);

// Protected routes
router.get("/profile", authenticateToken, getEmployeeProfile);
router.put("/profile", authenticateToken, updateEmployeeProfile);

export default router;
