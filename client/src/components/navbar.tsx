import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { LogOut, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { LogoWithText } from './logo'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu'
import Search from './search'

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <>
      <header className='fixed right-0 left-0 px-12 py-4 bg-white/40 dark:bg-black/40 backdrop-blur-lg z-[10] flex items-center justify-between'>
        <aside className='flex items-center gap-4'>
          <Link to='/' title='lynx logo'>
            <LogoWithText width={120} />
          </Link>
          <Search />
        </aside>

        <nav className='relative flex items-center gap-2'>
          <span>{user?.name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className='rounded-full w-fit h-fit p-3 '>
                <User size={21} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-5 mt-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <ThemeToggle />
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='p-0'>
                <Button onClick={() => logout()} className=' flex justify-start gap-2 bg-transparent text-white hover:bg-transparent w-full h-fit px-2'>
                  <LogOut size={18} />
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </nav>
      </header>
    </>
  )
}
