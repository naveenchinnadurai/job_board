import { Request, Response } from "express";
import db from "../db";
import { application, employee, employer, job } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { hashPassword } from "../services/auth.service";

export const registerEmployer = async (req: Request, res: Response) => {
  const { name, email, password, mobileNumber, location, industry } = req.body;

  const hashedPassword = await hashPassword(password);

  try {
    const newEmployer = await db
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

    res.status(201).json({
      message: "Employer registered successfully",
      id: newEmployer[0].id,
    });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
};

export const getEmployerProfile = async (req: Request, res: Response) => {
  const employerId = req.user?.id;

  if (!employerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const employerProfile = await db
      .select()
      .from(employer)
      .where(eq(employer.id, employerId))
      .limit(1);

    if (!employerProfile.length) {
      return res.status(404).json({ error: "Employer not found" });
    }

    const { password, ...profileWithoutPassword } = employerProfile[0];
    res.json(profileWithoutPassword);
  } catch (error) {
    console.error("Error fetching employer profile:", error);
    res.status(500).json({ error: "Failed to fetch employer profile" });
  }
};

export const updateEmployerProfile = async (req: Request, res: Response) => {
  const employerId = req.user?.id;
  const { name, mobileNumber, location, industry } = req.body;

  if (!employerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await db
      .update(employer)
      .set({ name, mobileNumber, location, industry })
      .where(eq(employer.id, employerId));

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating employer profile:", error);
    res.status(400).json({ error: "Profile update failed" });
  }
};

export const getJobApplications = async (req: Request, res: Response) => {
  const employerId = req.user?.id;
  const jobId = req.params.jobId;

  if (!employerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // First, check if the job belongs to the employer
    const jobOwnership = await db
      .select()
      .from(job)
      .where(and(eq(job.id, jobId), eq(job.employerId, employerId)))
      .limit(1);

    if (!jobOwnership.length) {
      return res.status(404).json({
        error:
          "Job not found or you're not authorized to view its applications",
      });
    }

    // Fetch applications with employee details
    const applications = await db
      .select({
        applicationId: application.id,
        status: application.status,
        appliedAt: application.appliedAt,
        employeeName: employee.name,
        employeeEmail: employee.email,
        employeeJobTitle: employee.jobTitle,
        employeeLocation: employee.location,
      })
      .from(application)
      .innerJoin(employee, eq(application.employeeId, employee.id))
      .where(eq(application.jobId, jobId));

    res.json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ error: "Failed to fetch job applications" });
  }
};

export const getAllJobsWithApplicationCounts = async (
  req: Request,
  res: Response
) => {
  const employerId = req.user?.id;

  if (!employerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const jobsWithCounts = await db
      .select({
        jobId: job.id,
        title: job.title,
        location: job.location,
        applicationCount: sql`count(${application.id})`.as("applicationCount"),
      })
      .from(job)
      .leftJoin(application, eq(job.id, application.jobId))
      .where(eq(job.employerId, employerId))
      .groupBy(job.id, job.title, job.location);

    res.json(jobsWithCounts);
  } catch (error) {
    console.error("Error fetching jobs with application counts:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch jobs with application counts" });
  }
};
