import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { TriangleAlertIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-md text-center'>
        <TriangleAlertIcon className='mx-auto h-12 w-12 text-primary' />
        <h1 className='mt-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
          404
        </h1>
        <p className='mt-4 text-muted-foreground'>
          Oops, the page you are looking for could not be found.
        </p>
        <div className='mt-6'>
          <Link to='/login'>
            <Button variant={'secondary'}>Back to Login Page</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
