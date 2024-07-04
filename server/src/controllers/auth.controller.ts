import { Request, Response } from "express";
import db from "../db";
import { employee, employer, session } from "../db/schema";
import { eq } from "drizzle-orm";
import { comparePasswords, createOrUpdateSession, hashPassword, refreshAccessToken } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, userType, mobileNumber, location } = req.body;

  const { industry } = req.body;
  const { jobTitle, resume } = req.body;

  // Check if user already exists
  let existingUser;
  if (userType === "employer") {
    existingUser = await db
      .select()
      .from(employer)
      .where(eq(employer.email, email))
      .limit(1);
  } else if (userType === "employee") {
    existingUser = await db
      .select()
      .from(employee)
      .where(eq(employee.email, email))
      .limit(1);
  } else {
    return res.json({ isSuccess: false, message: "Invalid user type" });
  }

  if (existingUser && existingUser.length > 0) {
    return res.json({ isSuccess: false, message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  let newUser;
  let type: string;
  try {
    if (userType === "employer") {
      type = "employer";
      [newUser] = await db
        .insert(employer)
        .values({
          name,
          email,
          password: hashedPassword,
          mobileNumber,
          location,
          industry,
        })
        .returning();
    } else {
      type = "employee";
      [newUser] = await db
        .insert(employee)
        .values({
          name,
          email,
          password: hashedPassword,
          mobileNumber,
          location,
          jobTitle,
          resume,
        })
        .returning();
    }

    // Create or update a session for the new user
    const { accessToken, refreshToken } = await createOrUpdateSession(
      newUser.id,
      userType,
      newUser.email,
      req.headers["user-agent"] || "",
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    );

    res.status(201).json({
      isSuccess: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        type
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ isSuccess: false, message: "Failed to register user" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user;
  let userType: "employer" | "employee";

  const employerUser = await db
    .select()
    .from(employer)
    .where(eq(employer.email, email))
    .limit(1);

  const employeeUser = await db
    .select()
    .from(employee)
    .where(eq(employee.email, email))
    .limit(1);

  if (employerUser.length > 0) {
    userType = "employer";
    user = employerUser;
  } else if (employeeUser.length > 0) {
    userType = "employee";
    user = employeeUser;
  } else {
    return res.status(400).json({ error: "User not found" });
  }

  if (!user || user.length === 0) {
    return res.status(400).json({ error: "User not found" });
  }

  const isPasswordValid = await comparePasswords(password, user[0].password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const { accessToken, refreshToken } = await createOrUpdateSession(
    user[0].id,
    userType,
    user[0].email,
    req.headers["user-agent"] || "",
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  );

  const userResponse = {
    id: user[0].id,
    email: user[0].email,
    type: userType,
    name: user[0].name,
    location: user[0].location,
    mobileNumber: user[0].mobileNumber,
  };

  res.json({ accessToken, refreshToken, userResponse });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const userAgent = req.headers["user-agent"] || "";

  try {
    const { accessToken, refreshToken: newRefreshToken } =
      await refreshAccessToken(refreshToken, userAgent);
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  await db.delete(session).where(eq(session.id, sessionId));
  res.json({ message: "Logged out successfully" });
};
