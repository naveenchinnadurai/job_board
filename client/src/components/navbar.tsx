import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "../components/ui/command"
import { toast } from '../hooks/use-toast'
import api from '../lib/api'
import { UserType } from '../lib/types'
import { LogoWithText } from './logo'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu'

export default function Navbar() {
  const { user, logout } = useAuth();
  const [employees, setEmployees] = useState<UserType[]>();
  const searchEmployee = async (e: string) => {
    if (e.length <= 1) {
      setEmployees([])
      return null;
    } else {
      const search = e;
      const res = await api.get(`/employee/profile/?name=${search}`)
      console.log(res)
      if (res.status == 200) {
        setEmployees(res.data.employees)
      } else {
        toast({
          title: "Error",
          description: res.data.error || "Error fetching User!"
        })
      }
    }
  }
  return (
    <>
      <header className='fixed right-0 left-0 px-12 py-4 bg-white/40 dark:bg-black/40 backdrop-blur-lg z-20 flex items-center justify-between'>
        <aside className='flex items-center gap-4'>
          <Link to='/' title='lynx logo'>
            <LogoWithText width={120} />
          </Link>
          <div className="relative">
            <Command className='px-0.5 w-72 h-10 border'>
              <CommandInput placeholder="Search ..." className="p-0" onValueChange={(e: string) => searchEmployee(e)} />
              <CommandList className='absolute top-10  left-0 z-50 bg-inherit w-full justify-start h-fit'>
                <CommandEmpty className='hidden'></CommandEmpty>
                <CommandGroup>
                  {
                    employees?.length == 0 ? (
                      <CommandItem value="null">No User Found</CommandItem>
                    ) : (
                      employees?.map((employee) => (
                        <CommandItem
                          key={employee.id}
                          value={employee.name || "Null"}
                          onSelect={(currentValue) => {
                            console.log(currentValue)
                          }}
                        >
                          {employee.name}
                        </CommandItem>
                      ))
                    )
                  }
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
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
