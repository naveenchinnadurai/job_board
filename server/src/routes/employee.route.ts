import express from "express";
import { registerEmployee, getEmployeeProfile, updateEmployeeProfile, getEmployeeByName } from "../controllers/employee.controller";
import { authenticateEmployee, authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

// Public route
router.post("/register", registerEmployee);

// Protected routes
router.get("/profile", authenticateToken, getEmployeeByName);

router.get("/profile/:id", authenticateToken, getEmployeeProfile);
router.put("/profile", authenticateEmployee, updateEmployeeProfile);

export default router;
