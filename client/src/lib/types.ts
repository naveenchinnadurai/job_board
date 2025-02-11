export interface User {
  id: string;
  email: string;
  type: 'employee' | 'employer';
  name: string | null;
  location: string | null;
  mobileNumber: string | null;
  sector: string | null
}

export interface JobType{
  id: string;
  employerId: string;
  title: string;
  description: string;
  location: string;
  experience: string;
  salary: string;
  industry: string;
  qualification: any; 
}