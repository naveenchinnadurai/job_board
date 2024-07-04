import { Button } from '../components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Plus } from 'lucide-react'
import { DialogDescription } from '@radix-ui/react-dialog'
import JobForm from '../components/employer/jobForm'
import ProfileCard from '../components/profileCard'

export default function CompanyDashboard() {
  return (
    <div className='container pt-36'>
      <ProfileCard/>
      <div className='flex justify-between mt-12 mb-8'>
        <h1 className='font-semibold text-2xl'>Posted jobs</h1>
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
              <DialogDescription>Add New Job. Provide Neccessary Details.</DialogDescription>
            </DialogHeader>
            <JobForm />
            <DialogFooter className='sm:justify-start'></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}