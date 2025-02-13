import express from "express";
import { login, refreshToken, logout, register } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/login", login);
router.post("/signup", register);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticateToken, logout);

export default router;
