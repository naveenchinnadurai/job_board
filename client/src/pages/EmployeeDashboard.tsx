import ProfileCard from '../components/profileCard'

export default function EmployeeDashboard() {


  return (
    <div className='container pt-36'>
      <ProfileCard/>
      <div className='flex justify-between mt-12 mb-8'>
        <h1 className='font-semibold text-2xl'>Related jobs</h1>
      </div>
    </div>
  )
}
