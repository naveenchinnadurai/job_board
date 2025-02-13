import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '../../auth/AuthContext'
import api from '../../lib/api'
import { jobFormSchema } from '../../schema/jobSchema'
import { Button } from '../ui/button'
import { DialogClose } from '../ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import MultipleSelector, { Option } from '../ui/multiselect'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { useToast } from '../../hooks/use-toast'

interface FormProp {
    id: string | undefined;
    description: string | undefined;
    experience: string | undefined,
    location: string | undefined,
    salary: string | undefined,
    sector: "Information Technology" | "Mechanical" | "Finance" | "Education" | "HealthCare" | undefined,
    title: string | undefined,
    method: "post" | "put"
}


function JobForm(props: FormProp) {
    const { toast } = useToast()
    const { user, jobs, setJobs } = useAuth();

    if (user?.type != 'employer') {
        toast({
            title: "Unauthorized",
            description: "You cannot Post or Edit a Job",
        })
        return;
    }

    const QUALIFICATION: Option[] = [
        { label: 'BE', value: 'BE' },
        { label: 'B.Tech', value: 'B.Tech' },
        { label: 'ME', value: 'ME' },
        { label: 'M.Tech', value: 'M.Tech' },
        { label: 'B.Sc', value: 'B.Sc' },
        { label: 'M.Sc', value: 'M.Sc' },
    ]

    const jobForm = useForm<z.infer<typeof jobFormSchema>>({
        resolver: zodResolver(jobFormSchema),
        defaultValues: {
            description: props.description,
            experience: props.experience,
            location: props.location,
            qualifications: [],
            salary: props.salary,
            sector: props.sector,
            title: props.title,
        },
    })

    async function jobOnSubmit(values: z.infer<typeof jobFormSchema>) {
        console.log(values)
        const { title, description, location, experience, salary, qualifications } = values;
        const job = {
            title,
            description,
            employerName: user?.name,
            location,
            experience,
            salary,
            industry: values.sector,
            qualification: qualifications.map(option => option.value)
        }
        if (props.method == "post") {
            try {
                const res = await api.post('job/', job)
                console.log(res)
                if (!res.status) {
                    toast({
                        title: "eRRor",
                        description: "Error Updating Job"
                    })
                    return;
                }
                setJobs(jobs?.concat(res.data.jobData))
                toast({
                    title: "Success",
                    description: res.data.message,
                })
            } catch (error) {
                console.log(error)
                toast({
                    title: "eRRor",
                    description: "Error during posting new Job",
                })
            }
        } else if (props.method == "put") {
            try {
                const res = await api.put(`job/${props.id}`, job)
                console.log(res);
                if (!res.status) {
                    toast({
                        title: "eRRor",
                        description: "Error Updating Job"
                    })
                    return;
                }
                setJobs(jobs?.map((item) => (item.id === res.data.jobData.id ? res.data.jobData : item)));
                toast({
                    title: "Success",
                    description: res.data.message,
                })
            } catch (error) {
                toast({
                    title: "eRRor",
                    description: "Error During Updating Job Details",
                })
            }
        }
    }
    return (
        <>
            <div className='flex items-center space-x-2'>
                <div className='grid flex-1 gap-2'>
                    <Form {...jobForm}>
                        <FormDescription></FormDescription>
                        <form
                            onSubmit={jobForm.handleSubmit(jobOnSubmit)}
                            className='flex flex-col gap-4'>
                            <div className='flex w-full gap-4'>
                                <FormField
                                    control={jobForm.control}
                                    name='title'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormLabel>Job title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Job Title'
                                                    {...field}
                                                    className='w-full'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={jobForm.control}
                                    name='salary'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormLabel>Salary</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='1000000'
                                                    {...field}
                                                    className='w-full'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={jobForm.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormLabel>Job description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Tell a little bit about the job'
                                                className='resize-y min-h-24'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex w-full gap-4'>
                                <FormField
                                    control={jobForm.control}
                                    name='experience'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormLabel>Experience</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='1'
                                                    {...field}
                                                    className='w-full'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={jobForm.control}
                                    name='location'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Tamilnadu, India'
                                                    {...field}
                                                    className='w-full'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='flex w-full gap-4'>
                                <FormField
                                    control={jobForm.control}
                                    name='qualifications'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormLabel>Qualification</FormLabel>
                                            <FormControl>
                                                <MultipleSelector
                                                    {...field}
                                                    defaultOptions={QUALIFICATION}
                                                    placeholder='Select the qualifications'
                                                    emptyIndicator={
                                                        <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                                                            no results found.
                                                        </p>
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={jobForm.control}
                                    name='sector'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormLabel>Industry</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Industry' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='Information Technology'>Information Technology</SelectItem>
                                                    <SelectItem value='Mechanical'>Mechanical</SelectItem>
                                                    <SelectItem value='Finance'>Finance</SelectItem>
                                                    <SelectItem value='Education'>Education</SelectItem>
                                                    <SelectItem value='HealthCare'>Health Care</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogClose>
                                <Button type='submit' className=' mt-4'>{props.method == "post" ? "Post Job" : "Update Job"}</Button>
                            </DialogClose>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default JobForm