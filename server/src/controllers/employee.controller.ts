import { Request, Response } from "express";
import db from "../db";
import { application, employee, job } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { hashPassword } from "../services/auth.service";

export const registerEmployee = async (req: Request, res: Response) => {
  const { name, email, password, jobTitle, mobileNumber, location, resume } =
    req.body;

  const hashedPassword = await hashPassword(password);

  try {
    const newEmployee = await db
      .insert(employee)
      .values({
        name,
        email,
        password: hashedPassword,
        jobTitle,
        mobileNumber,
        location,
        resume,
      })
      .returning();

    res.status(201).json({
      message: "Employee registered successfully",
      id: newEmployee[0].id,
    });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
};

export const getEmployeeProfile = async (req: Request, res: Response) => {
  const employeeId = req.user?.id;

  if (!employeeId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const employeeProfile = await db
      .select()
      .from(employee)
      .where(eq(employee.id, employeeId))
      .limit(1);

    if (!employeeProfile.length) {
      return res.status(404).json({ error: "Employer not found" });
    }

    const { password, ...profileWithoutPassword } = employeeProfile[0];
    res.json(profileWithoutPassword);
  } catch (error) {
    console.error("Error fetching employer profile:", error);
    res.status(500).json({ error: "Failed to fetch employer profile" });
  }
};

export const updateEmployeeProfile = async (req: Request, res: Response) => {
  const employeeId = req.user?.id;
  const { name, mobileNumber, location, jobTitle, resume } = req.body;
  console.log({ name, mobileNumber, location, jobTitle, resume })
  if (!employeeId) {
    return res.status(401).json({ isSuccess: false, message: "Unauthorized" });
  }

  try {
    const result = await db.update(employee).set({ name, jobTitle, mobileNumber, location, resume }).where(eq(employee.id, employeeId));

    res.json({ isSuccess: true, message: "Profile updated successfully", user: result });
  } catch (error) {
    console.error("Error updating employer profile:", error);
    res.json({ isSuccess: false, message: "Profile update failed" });
  }
};

export const getEmployeeApplications = async (req: Request, res: Response) => {
  const employeeId = req.user?.id;

  if (!employeeId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const applications = await db
      .select({
        applicationId: application.id,
        jobId: job.id,
        jobTitle: job.title,
        jobLocation: job.location,
        jobSalary: job.salary,
        applicationStatus: application.status,
        appliedAt: application.appliedAt,
      })
      .from(application)
      .innerJoin(job, eq(application.jobId, job.id))
      .where(eq(application.employeeId, employeeId))
      .orderBy(desc(application.appliedAt));

    res.json(applications);
  } catch (error) {
    console.error("Error fetching employee applications:", error);
    res.status(500).json({ error: "Failed to fetch employee applications" });
  }
};
