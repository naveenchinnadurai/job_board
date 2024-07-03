import { useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Link } from 'react-router-dom'
import { LogoWithText } from './logo'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu'
import { ChevronDown, ChevronUp, LogOut } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export default function Navbar() {
  const {user}=useAuth()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <header className='fixed right-0 left-0 px-12 py-4 bg-white/40 dark:bg-black/40 backdrop-blur-lg z-[10] flex items-center justify-between'>
        <aside className='flex items-center gap-[2px]'>
          <Link to='/' title='lynx logo'>
            <LogoWithText width={120} />
          </Link>
        </aside>
        <nav className='flex  items-center gap-4'>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                onClick={() => setIsOpen(!isOpen)}
                className='transition-all'>
                {user?.name}
                {isOpen ? (
                  <ChevronUp size={16} className='ml-2' />
                ) : (
                  <ChevronDown size={16} className='ml-2' />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-32'>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
    </>
  )
}
