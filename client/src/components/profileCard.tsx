import { Label } from '@radix-ui/react-label'
import { Card } from '../components/ui/card'
import DotPattern from '../components/ui/dot-pattern'
import { cn } from '../lib/utils'
import { useAuth } from '../auth/AuthContext'
function ProfileCard() {
    const { user, type } = useAuth()

    const userDetails = [
        [type === "employee" ? "User Name" : "Company Name", user?.name],
        ["Location", user?.location],
        ["Mobile Number", user?.mobileNumber],
        [type === "employer" ? "Job Title" : "Industry", user?.sector],
        ["Email", user?.email],
    ]
    return (
        <Card className='p-4'>
            <div className='flex flex-col sm:flex-row  gap-8'>
                <div className='flex-none w-full sm:w-64'>
                    <div className='relative flex h-[250px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl'>
                        <p className='z-10 whitespace-pre-wrap text-center text-3xl font-bold tracking-normal text-black dark:text-white'>{user?.name} </p>
                        <DotPattern width={25} height={25} cx={1} cy={1} cr={1} className={cn('[mask-image:linear-gradient(to_bottom,transparent,white,transparent)]')} />
                    </div>
                </div>
                <div className='flex-1 flex flex-col gap-7'>
                    <h1 className='text-xl font-bold'>{type ? "User" : "Company"} Profile</h1>
                    <div className='relative'>
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
                            {
                                userDetails.map((e, i) => {
                                    return (
                                        <div className='flex flex-col gap-2' key={i}>
                                            <Label className='text-sm font-semibold text-muted-foreground'>{e[0]}</Label>
                                            <p className='text-sm'>{e[1]}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ProfileCard