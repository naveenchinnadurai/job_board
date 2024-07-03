import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, User } from "../services/auth.service";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  const user = verifyAccessToken(token);
  if (!user) {
    return res.sendStatus(403);
  }

  req.user = user as User;
  next();
};
