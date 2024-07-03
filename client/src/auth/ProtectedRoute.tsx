import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Button } from '../components/ui/button'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return (
      <div className='flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
        <p className='mt-4 text-muted-foreground'>Oops, You don't have Access to this Page</p>
        <div className='mt-6'>
          <Link to='/login'>
            <Button variant={'secondary'}>Login to Continue</Button>
          </Link>
        </div>
      </div>
    )
  }

  return children
}
