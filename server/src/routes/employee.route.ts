import express from "express";
import { registerEmployee, getEmployeeProfile, updateEmployeeProfile, } from "../controllers/employee.controller";
import { authenticateEmployee } from "../middleware/auth.middleware";

const router = express.Router();

// Public route
router.post("/register", registerEmployee);

// Protected routes
router.get("/profile", authenticateEmployee, getEmployeeProfile);
router.put("/profile", authenticateEmployee, updateEmployeeProfile);

export default router;
