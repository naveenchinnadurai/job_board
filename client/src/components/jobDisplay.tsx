import { Label } from '@radix-ui/react-label'
import { Eye, SquarePen, Trash } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import { JobType } from '../lib/types'
import { shorten } from '../lib/utils'
import JobForm from './employer/jobForm'
import { Button } from './ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

const JobsDisplay = () => {
    const { jobs } = useAuth();
    return (
        <div className='grid grid-cols-2 w-full gap-5 justify-center mb-4'>
            {
                jobs && jobs.length > 0 ? jobs.map((job: JobType) => (
                    <JobCard key={job.id} {...job} />
                )) : <p>No jobs available</p>
            }
        </div >
    )
}

function JobCard(props: JobType) {
    const { user } = useAuth();

    const footer: any = [
        ["Location", props.location],
        ["Salary", props.salary],
        ["Experience(year)", props.experience],
        ["Qualification", props.qualification]
    ];

    const deleteJob = async (id: string | null) => {
        console.log("delete", id);
    };

    const apply = () => {
        console.log("apply");
    };

    return (
        <Card className='max-w-7xl'>
            <div className='flex w-full'>
                <CardHeader className='w-11/12'>
                    <CardTitle className='text-2xl'>{props.title}</CardTitle>
                    {
                        user?.type == "employee" && <CardDescription className='text-lg'>{props.employerName}</CardDescription>
                    }
                    <CardDescription className='line-clamp-2'>{shorten(props.description, 20)}</CardDescription>
                    <CardFooter className='p-0 !mt-6'>
                        <div className='flex flex-wrap w-full justify-between'>
                            {
                                footer.map((e: any, i: number) => (
                                    <div className='flex-col' key={i}>
                                        <Label className='text-sm'>{e[0]}: </Label>
                                        <p className='text-sm text-muted-foreground'>{e[1]}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </CardFooter>
                </CardHeader>
                <div className="flex w-fit border-l px-4 py-2 ">
                    <div className='flex flex-col  gap-4 justify-between'>
                        {/* See more dialog */}
                        <Dialog>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <DialogTrigger asChild>
                                            <Button variant={'outline'}>
                                                <Eye size={16} className='' />
                                            </Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side='bottom'>
                                        {user?.type == "employee" ? "See in detail" : "Dashboard"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>


                            <DialogContent className='sm:max-w-md sm:min-w-md md:min-w-[800px]'>
                                <DialogHeader>
                                    <DialogTitle className='mb-4 text-3xl'>
                                        {user?.type === 'employee' ? "Job Details" : "Applicants & Dashboard"}
                                    </DialogTitle>
                                </DialogHeader>

                                {/* Employee View: Show Job Details */}
                                {user?.type === 'employee' && (
                                    <div>
                                        <h3 className='font-medium text-xl'>{props.title}</h3>
                                        <h3 className='font-medium text-lg'>Zween Info Tech</h3>
                                        <p className="text-md my-1">{props.description}</p>
                                        <div className='flex flex-wrap w-full justify-between'>
                                            {footer.map((e: any, i: number) => (
                                                <div className='flex-col w-1/6' key={i}>
                                                    <Label className='text-sm'>{e[0]}: </Label>
                                                    <p className='text-sm text-muted-foreground'>{e[1]}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end my-5">
                                            <DialogClose className='flex justify-end gap-3'>
                                                <Button
                                                    variant="secondary"
                                                    className='px-5 py-2 h-fit'
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={() => apply()}
                                                    className="px-7 py-2 h-fit"
                                                >
                                                    Apply
                                                </Button>
                                            </DialogClose>
                                        </div>
                                    </div>
                                )}

                                {/* Employer View: Show Applied Employees List */}
                                {user?.type === 'employer' && (
                                    <div>
                                        <h3 className='font-medium text-xl'>Employees Applied</h3>
                                        {/* Placeholder for applied employees list */}
                                        <ul className="mt-3">
                                            <li className="p-2 border-b">John Doe - johndoe@example.com</li>
                                            <li className="p-2 border-b">Jane Smith - janesmith@example.com</li>
                                            {/* Fetch and map applied users dynamically */}
                                        </ul>
                                        <div className="flex justify-end my-3">
                                            <DialogClose className='flex justify-end gap-3'>
                                                <Button>Close</Button>
                                            </DialogClose>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>

                        {/* Employer Edit/Delete Options */}
                        {user?.type === 'employer' && (
                            <div className='pb-2 flex flex-col gap-4 items-center justify-center'>
                                {/* Edit Job Dialog */}
                                <Dialog>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <DialogTrigger asChild>
                                                    <Button variant={'outline'}>
                                                        <SquarePen size={18} className='' />
                                                    </Button>
                                                </DialogTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent side='top'> Edit </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <DialogContent className='sm:max-w-md sm:min-w-md md:min-w-[800px]'>
                                        <DialogHeader>
                                            <DialogTitle className='mb-4'>Edit Job</DialogTitle>
                                        </DialogHeader>
                                        <JobForm
                                            id={props.id}
                                            description={props.description}
                                            experience={props.experience}
                                            location={props.location}
                                            salary={props.salary}
                                            sector={props.industry as "Information Technology" | "Mechanical" | "Finance" | "Education" | "HealthCare"}
                                            title={props.title}
                                            method="put"
                                        />
                                        <DialogFooter className='sm:justify-start'></DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                {/* Close Job BUtton */}
                                <Dialog>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <DialogTrigger asChild>
                                                    <Button variant={'destructive'}>
                                                        <Trash size={20} className='' />
                                                    </Button>
                                                </DialogTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent side='bottom'> Close Job </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <DialogContent className='sm:max-w-md sm:min-w-md md:min-w-[800px] max-w-xl'>
                                        <DialogHeader>
                                            <DialogTitle className='mb-4'>Delete Job</DialogTitle>
                                        </DialogHeader>
                                        <span className="text-xl my-2">Do you want to Delete this Job?</span>
                                        <DialogFooter className='sm:justify-start'>
                                            <DialogClose className='flex gap-2'>
                                                <Button>Cancel</Button>
                                                <Button variant={'destructive'} onClick={() => deleteJob(props.id)}>Confirm</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}


export default JobsDisplay  