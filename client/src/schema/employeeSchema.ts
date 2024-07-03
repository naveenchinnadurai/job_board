import { z } from 'zod'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ACCEPTED_FILE_TYPES = [ 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ]

export const employeeFormSchema:any = z.object({
    name: z.string().min(1, { message: 'Employee name cannot be empty' }),
    jobTitle: z.enum(
      [
        'Software Engineer',
        'Full Stack Developer',
        'Business Analyst',
        'Professor',
        'Doctor',
        'Mechanical Engineer',
      ],
      {
        required_error: 'Please select a job title.',
      },
    ),
    mobileNumber: z.string().regex(/^[0-9]{10}$/, { message: 'Invalid mobile number' }),
    location: z.string().min(1, { message: 'Location is required' }),
    resume: z.any().refine((files) => files?.length == 1, 'Please attach your resume.')
    .refine( (files) => files?.[0]?.size <= MAX_FILE_SIZE,`Max file size is 2MB.`,)
    .refine( (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), 'Only .pdf and .docx files are accepted.'),
  })