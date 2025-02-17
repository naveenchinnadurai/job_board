import { Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import JobForm from '../components/employer/jobForm';
import JobsDisplay from '../components/jobDisplay';
import ProfileCard from '../components/profileCard';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { toast } from '../hooks/use-toast';
import { fetchJobs } from '../lib/api';

export default function Dashboard() {
  const { user, setJobs } = useAuth()

  const getJobs = async () => {
    const jobs = await fetchJobs(user?.id || '', user?.type || '');
    if (jobs) {
      setJobs(jobs);
      toast({
        title: "Success",
        description: user?.type == 'employee' ? "Latest Jobs Fetched" : "Your Job Posting is fetched"
      })
    } else {
      toast({
        title: "Error",
        description: "Error during fetching Jobs"
      })
    }
  }
  return (
    <div className='container pt-24'>
      <ProfileCard />
      <div className='flex justify-between items-center my-5'>
        <div className="flex gap-1 items-center justify-center">
          <h1 className='font-semibold text-xl'>{user?.type == "employer" ? "Jobs Posted By You" : "Related Jobs"}</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button className='bg-transparent h-fit w-fit px-2 hover:bg-transparent' onClick={() => getJobs()}>
                  <RefreshCw size={18} className='text-white' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top' className='!bg-zinc-950 !text-white border border-zinc-700'> Refresh </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {
          user?.type == "employer" ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline' className=''>
                  <Plus size={16} className='mr-2' />
                  Add a new job
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-md sm:min-w-md md:min-w-[800px]'>
                <DialogHeader>
                  <DialogTitle className='mb-4'>New job</DialogTitle>
                  <DialogDescription>Add New Job. Provide Necessary Details.</DialogDescription>
                </DialogHeader>
                <JobForm method="post" />
                <DialogFooter className='sm:justify-start'></DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null
        }
      </div>
      <JobsDisplay />
    </div>
  )
}