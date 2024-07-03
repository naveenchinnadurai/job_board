import { z } from "zod"

const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
})

export const jobFormSchema = z.object({
    title: z.string().min(1, { message: 'Job title cannot be empty' }),
    description: z.string().min(1, { message: 'Description is required' }),
    location: z.string().min(1, { message: 'Location is required' }),
    salary: z.string().regex(/^[0-9]{1,14}$/, { message: 'Salary is required' }),
    qualifications: z.array(optionSchema).min(1, { message: 'Qualification is required' }),
    experience: z.string().regex(/^[0-9]{1,14}$/, { message: 'Experience is required' }),
    sector: z.enum(['IT', 'Mechanical', 'Finance', 'Education', 'HealthCare'], { required_error: 'Please select a job sector.' }),
})

