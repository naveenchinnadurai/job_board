import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, User } from "../services/auth.service";

const getToken = (req: Request) => {
  const authHeader = req.headers["authorization"];
  return authHeader && authHeader.split(" ")[1];
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = getToken(req);
  if (!token) {
    return res.sendStatus(401);
  }

  const user = verifyAccessToken(token);
  console.log("User: ", user)
  if (!user) {
    return res.sendStatus(403);
  }

  req.user = user as User;
  next();
};

export const authenticateEmployer = (req: Request, res: Response, next: NextFunction) => {
  const token = getToken(req);
  if (!token) {
    return res.sendStatus(401);
  }

  const user = verifyAccessToken(token);
  console.log("User: ", user)

  if (!user) return res.sendStatus(403).json({ error: "No Access Token" });

  if (!user.id) return res.status(401).json({ error: "Unauthorized" });

  if (user.userType != "employer") return res.status(405).json({ error: "You don't have access to do this!" });

  req.user = user as User;
  next();
};

export const authenticateEmployee = (req: Request, res: Response, next: NextFunction) => {
  const token = getToken(req);
  if (!token) {
    return res.sendStatus(401);
  }

  const user = verifyAccessToken(token);
  console.log("User: ", user)

  if (!user) return res.sendStatus(403).json({ error: "No Access Token" });

  if (!user.id) return res.status(401).json({ error: "Unauthorized" });

  if (user.userType != "employee") return res.sendStatus(403).json({ error: "You don't have access to do this!" });


  req.user = user as User;
  next();
};