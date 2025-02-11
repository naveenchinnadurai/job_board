import JobsDisplay from '../components/jobDisplay'
import ProfileCard from '../components/profileCard'

export default function EmployeeDashboard() {
  return (
    <div className='container pt-36'>
      <ProfileCard />
      <div className='flex flex-col justify-center items-center mt-12 mb-8'>
        <h1 className='font-semibold text-2xl mb-3'>Related jobs</h1>
        <JobsDisplay />
      </div>
    </div>
  )
}
