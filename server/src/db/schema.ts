import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const employer = pgTable("employer", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  mobileNumber: text("mobile_number").unique(),
  location: text("location"),
  industry: text("industry"),
});

export const employerRelations = relations(employer, ({ many }) => ({
  jobs: many(job),
}));

export const employee = pgTable("employee", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  jobTitle: text("job_title"),
  mobileNumber: text("mobile_number").unique(),
  location: text("location"),
  resume: text("resume"),
});

export const employeeRelations = relations(employee, ({ many }) => ({
  applications: many(application),
}));

export const job = pgTable(
  "job",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employerId: uuid("employer_id")
      .notNull()
      .references(() => employer.id),
    title: text("title").unique().notNull(),
    description: text("description").notNull(),
    location: text("location").notNull(),
    experience: text("experience").notNull(),
    salary: text("salary").notNull(),
    industry: text("industry").notNull(),
    qualification: text("qualification").notNull(),
  },
  (table) => {
    return {
      employerIdIdx: index("employer_id_idx").on(table.employerId),
    };
  }
);

export const jobRelations = relations(job, ({ one, many }) => ({
  employer: one(employer, {
    fields: [job.employerId],
    references: [employer.id],
  }),
  applications: many(application),
}));

export const application = pgTable(
  "application",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => job.id),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employee.id),
    status: text("status").notNull(),
    appliedAt: timestamp("applied_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      jobIdIdx: index("job_id_idx").on(table.jobId),
      employeeIdIdx: index("employee_id_idx").on(table.employeeId),
    };
  }
);

export const applicationRelations = relations(application, ({ one }) => ({
  job: one(job, {
    fields: [application.jobId],
    references: [job.id],
  }),
  employee: one(employee, {
    fields: [application.employeeId],
    references: [employee.id],
  }),
}));

export const session = pgTable(
  "session",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    userType: text("user_type").notNull(),
    email: text("email").notNull(),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("user_id_idx").on(table.userId),
      emailIdx: index("email_idx").on(table.email),
    };
  }
);

export const sessionRelations = relations(session, ({ one }) => ({
  employer: one(employer, {
    fields: [session.userId],
    references: [employer.id],
    relationName: "employerSession",
  }),
  employee: one(employee, {
    fields: [session.userId],
    references: [employee.id],
    relationName: "employeeSession",
  }),
}));
