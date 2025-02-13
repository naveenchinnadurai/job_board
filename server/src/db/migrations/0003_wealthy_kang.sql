ALTER TABLE "job" ADD COLUMN "employee_name" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job" ADD CONSTRAINT "job_employee_name_employer_name_fk" FOREIGN KEY ("employee_name") REFERENCES "public"."employer"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
