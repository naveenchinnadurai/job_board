import express from "express";
import {
  login,
  refreshToken,
  logout,
  register,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", login);
router.post("/signup", register);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
