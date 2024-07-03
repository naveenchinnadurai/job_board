import { z } from "zod";

export const companyFormSchema = z.object({
    name: z.string().min(1, { message: 'Company name cannot be empty' }),
    location: z.string().min(1, { message: 'Location is required' }),
    mobileNumber: z.string().regex(/^[0-9]{10}$/, { message: 'Invalid mobile number' }),
    sector: z.enum(['Information Technology', 'Mechanical', 'Finance', 'Education', 'HealthCare'], {
        required_error: 'Please select a company sector.',
    }),
})