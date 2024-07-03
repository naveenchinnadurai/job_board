import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db";
import { session } from "../db/schema";
import { eq, gt, and } from "drizzle-orm";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

const ACCESS_TOKEN_SECRET = JWT_SECRET;
const REFRESH_TOKEN_SECRET = JWT_REFRESH_SECRET;

export interface User {
  id: string;
  userType: "employer" | "employee";
  email: string;
}

export const generateTokens = (user: User) => {
  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): User | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as User;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): User | null => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as User;
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const createOrUpdateSession = async (
  userId: string,
  userType: "employer" | "employee",
  email: string,
  userAgent: string,
  expiresAt: Date
) => {
  const user: User = { id: userId, userType, email };
  const { accessToken, refreshToken } = generateTokens(user);

  const existingSession = await db
    .select()
    .from(session)
    .where(eq(session.email, email))
    .limit(1);

  if (existingSession.length > 0) {
    // Update existing session
    await db
      .update(session)
      .set({
        userId,
        userType,
        userAgent,
        expiresAt,
      })
      .where(eq(session.email, email));
  } else {
    // Create new session
    await db.insert(session).values({
      userId,
      userType,
      email,
      userAgent,
      expiresAt,
    });
  }

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (
  refreshToken: string,
  userAgent: string
) => {
  const user = verifyRefreshToken(refreshToken);
  if (!user) {
    throw new Error("Invalid refresh token");
  }

  const existingSession = await db
    .select()
    .from(session)
    .where(
      and(
        eq(session.userId, user.id),
        eq(session.userAgent, userAgent),
        gt(session.expiresAt, new Date())
      )
    )
    .limit(1);

  if (existingSession.length === 0) {
    throw new Error("Session not found or expired");
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await db
    .update(session)
    .set({ expiresAt })
    .where(eq(session.id, existingSession[0].id));

  return { accessToken, refreshToken: newRefreshToken };
};
