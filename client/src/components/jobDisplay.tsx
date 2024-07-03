import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogClose, DialogDescription, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from '@radix-ui/react-label'
import { Button } from './ui/button'
import { Eye, Pencil, Trash } from 'lucide-react'
import JobForm from './employer/jobForm'
import { useData } from '../context/DataContext'
import { del, put } from '../lib/api'
import { Job } from '../lib/types'

interface Prop {
    id: number | null;
    title: string | null;
    companyName: string | null;
    description: string | null | undefined;
    location: string | null;
    salary: string | null;
    experience: string | null;
    qualification: string[] | null;
    appliedBy: number[] | null | undefined
}

export const JobsDisplay = () => {
    const { jobs } = useData()
    return (
        <div className='flex flex-col w-full gap-10 justify-center'>
            {
                jobs?.map((e: Job, i: number) => {
                    return (
                        <div key={i}>
                            <JobCard
                                key={i}
                                appliedBy={e.applied_by}
                                id={e.id}
                                title={e.job_title}
                                companyName={e.company_name}
                                description={e.description}
                                location="Tamil Nadu"
                                salary={e.stipend}
                                experience={e.experience}
                                qualification={e.qualification}
                            />
                        </div>
                    )
                })
            }
        </div>
    )
}

function JobCard(props: Prop) {
    const { data, setJobs, setData, type } = useData()
    const id: any = data.id
    const flag: boolean = !!props?.appliedBy?.includes(id)
    const footer: any = [
        ["Location", props.location],
        ["Salary", props.salary],
        ["Experience(year)", props.experience],
        ["Qualification", props.qualification]
    ]

    const deleteJob = async (id: number | null) => {
        try {
            const res = await del(`http://localhost:5000/api/v1/job/${id}`)
            console.log(res)
            setJobs((prevJobs: Job[]) => prevJobs.filter(job => job.id !== id));
        } catch (err) {
            console.log(err)
        }
    }

    const apply = async () => {
        const temp: any = props.appliedBy;
        temp?.push(data.id)
        try {
            const res = await put(`http://localhost:5000/api/v1/job/${props.id}`, {
                field: "applied_by",
                value: temp
            })
            console.log(res)
            if (!res?.data.isSuccess) {
                console.log(res?.data.message)
                return;
            }
            const applied: any = data.jobs
            applied.push(props.id)
            setData({
                isLoggedIn: true,
                id: data.id,
                user: {
                    email: data.user?.email,
                    user_type: data.user?.user_type
                },
                accessToken: data.accessToken,
                name: data.name,
                mobileNumber: data.mobileNumber,
                sector: data.sector,
                location: data.location,
                jobs: applied
            })
            const response = await put(`http://localhost:5000/api/v1/employee/${data.id}`, {
                field: "jobs_applied",
                value: applied
            })
            console.log(response)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <Card className=' max-w-7xl'>
            <div className='flex w-full '>
                <CardHeader className='w-11/12'>
                    <CardTitle className='text-2xl'>{props.title}</CardTitle>
                    <CardDescription className='text-lg'>{props.companyName}</CardDescription>
                    <CardDescription className='line-clamp-2'>{props.description}</CardDescription>
                    <CardFooter className='p-0 !mt-6'>
                        <div className='flex flex-wrap w-full  justify-between'>
                            {
                                footer.map((e: any, i: number) => {
                                    return (
                                        <div className='flex-col' key={i}>
                                            <Label className='text-sm'>{e[0]}: </Label>
                                            <p className='text-sm text-muted-foreground'>{e[1]}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </CardFooter>
                </CardHeader>
                <div className={`flex w-fit border-l px-4 py-2 ${type ? "" : "items-center"}`}>
                    <div className='flex flex-col gap-4'>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant={'outline'}>
                                    <Eye size={16} className='' />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-md sm:min-w-md md:min-w-[800px]'>
                                <DialogHeader>
                                    <DialogTitle className='mb-4 text-3xl'>Job details</DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <div className='flex flex-col'>
                                    <h3 className='font-medium text-xl'>{props.title}</h3>
                                    <h3 className='font-medium text-lg'>{props.companyName}</h3>
                                    <p className="text-lg my-1">{props.description}</p>
                                </div>
                                <div className='flex flex-wrap w-full  justify-between'>
                                    {
                                        footer.map((e: any, i: number) => {
                                            return (
                                                <div className='flex-col w-1/6' key={i}>
                                                    <Label className='text-sm'>{e[0]}: </Label>
                                                    <p className='text-sm text-muted-foreground'>{e[1]}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="flex justify-end my-3">
                                    <DialogClose className='flex justify-end gap-3'>
                                        <Button className='flex justify-end gap-3'>Cancel</Button>
                                        {
                                            type ? (
                                                <Button variant={'secondary'} onClick={() => apply()} disabled={flag} className={flag ? "cursor-not-allowed" : ""}>{!!props?.appliedBy?.includes(id) ? "Applied" : "Apply Now"}</Button>
                                            ) : null
                                        }
                                    </DialogClose>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <>
                            {
                                !type ? (
                                    <>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant={'outline'}>
                                                    <Pencil size={16} className='' />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className='sm:max-w-md sm:min-w-md md:min-w-[800px]'>
                                                <DialogHeader>
                                                    <DialogTitle className='mb-4'>New job</DialogTitle>
                                                    <DialogDescription></DialogDescription>
                                                </DialogHeader>
                                                <JobForm />
                                                <DialogFooter className='sm:justify-start'></DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant={`destructive`}>
                                                    <Trash size={16} className='' />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className='sm:max-w-md sm:min-w-md md:min-w-[800px] max-w-xl'>
                                                <DialogHeader>
                                                    <DialogTitle className='mb-4'>Delete Job</DialogTitle>
                                                    <DialogDescription></DialogDescription>
                                                </DialogHeader>
                                                <span className="text-xl my-2">Do you want to Delete this Job?</span>
                                                <DialogFooter className='sm:justify-start'>
                                                    <DialogClose className='flex gap-2'>
                                                        <Button >Cancel</Button>
                                                        <Button variant={'destructive'} onClick={() => deleteJob(props.id)}>Confirm</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </>
                                ) : null
                            }
                        </>
                    </div>
                </div>
            </div>
        </Card >
    )
}

export default JobsDisplay