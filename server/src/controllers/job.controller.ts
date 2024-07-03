import { Request, Response } from "express";
import db from "../db";
import { job, application } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const createJob = async (req: Request, res: Response) => {
  const employerId = req.user?.id;

  if (!employerId) {
    return res.json({ isSuccess: false, message: "Unauthorized: Employer ID not found" });
  }

  const {
    title,
    description,
    location,
    experience,
    salary,
    industry,
    qualification,
  } = req.body;

  try {
    const newJob = await db
      .insert(job)
      .values({
        employerId,
        title,
        description,
        location,
        experience,
        salary,
        industry,
        qualification,
      })
      .returning();

    res.status(201).json({ message: "Job created successfully", id: newJob[0].id });
  } catch (error) {
    console.error("Error creating job:", error);
    res.json({ isSuccess: false, message: "Job creation failed" });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  const jobs = await db.select().from(job);
  res.json(jobs);
};

export const getJob = async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const jobDetails = await db
    .select()
    .from(job)
    .where(eq(job.id, jobId))
    .limit(1);

  if (!jobDetails.length) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json(jobDetails[0]);
};

export const updateJob = async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const employerId = req.user?.id;

  if (!employerId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Employer ID not found" });
  }

  const {
    title,
    description,
    location,
    experience,
    salary,
    industry,
    qualification,
  } = req.body;

  try {
    const result = await db
      .update(job)
      .set({
        title,
        description,
        location,
        experience,
        salary,
        industry,
        qualification,
      })
      .where(and(eq(job.id, jobId), eq(job.employerId, employerId)));

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "Job not found or you're not authorized to update it" });
    }

    res.json({ message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Job update failed" });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const employerId = req.user?.id;

  if (!employerId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Employer ID not found" });
  }

  try {
    const result = await db
      .delete(job)
      .where(and(eq(job.id, jobId), eq(job.employerId, employerId)));

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "Job not found or you're not authorized to delete it" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Job deletion failed" });
  }
};

export const applyForJob = async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const employeeId = req.user?.id;

  if (!employeeId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Employee ID not found" });
  }

  try {
    const jobExists = await db
      .select()
      .from(job)
      .where(eq(job.id, jobId))
      .limit(1);
    if (jobExists.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    const existingApplication = await db
      .select()
      .from(application)
      .where(
        and(
          eq(application.jobId, jobId),
          eq(application.employeeId, employeeId)
        )
      )
      .limit(1);

    if (existingApplication.length > 0) {
      return res
        .status(400)
        .json({ error: "You have already applied for this job" });
    }

    await db.insert(application).values({
      jobId,
      employeeId,
      status: "pending",
    });

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ error: "Application submission failed" });
  }
};
