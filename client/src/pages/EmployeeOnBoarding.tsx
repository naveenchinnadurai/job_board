import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LogoWithText } from '../components/logo'
import { ThemeToggle } from '../components/theme-toggle'
import { Button } from '../components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { employeeFormSchema } from '../schema/employeeSchema'
import api from '../lib/api';
import { useNavigate } from 'react-router-dom'

export default function EmployeeOnBoarding() {
  const navigate = useNavigate()

  const employeeForm = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: '',
      jobTitle: undefined,
      mobileNumber: '',
      location: '',
      resume: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof employeeFormSchema>) {
    console.log(values)
    const { name, mobileNumber, location, jobTitle } = values
    let user=JSON.parse(localStorage.getItem("user") || '{}')
    try {
      const res = await api.put('http://localhost:5000/api/v1/employee/profile', {
        employeeId: user.id,
        location,
        mobileNumber,
        name,
        jobTitle: jobTitle
      })
      console.log(res)
      if (!res.data.isSuccess) {
        console.log(res.data.message)
        return;
      }
      user = {
        id: user.id,
        email: user.email,
        type: user.type,
        name: name,
        location: location,
        mobileNumber: mobileNumber,
        sector: jobTitle
      }

      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isLoggedIn', 'true')
      navigate('/dashboard/employee')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }
  return (
    <>
      <div className='absolute right-8 top-8 flex items-center gap-2'>
        <ThemeToggle />
      </div>
      <div className='flex h-svh w-svw items-center justify-center'>
        <div className='flex min-w-[400px] flex-col gap-4'>
          <LogoWithText width={120} className='mb-4' />
          <h1 className='text-2xl font-bold mb-2'>Employee details</h1>
          <Form {...employeeForm}>
            <form
              onSubmit={employeeForm.handleSubmit(onSubmit)}
              className='flex flex-col gap-4'>
              <FormField
                control={employeeForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name='jobTitle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job title</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select job title' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Software Engineer'>
                          Software Engineer
                        </SelectItem>
                        <SelectItem value='Full Stack Developer'>
                          Full Stack Developer
                        </SelectItem>
                        <SelectItem value='Business Analyst'>
                          Business Analyst
                        </SelectItem>
                        <SelectItem value='Mechanical Engineer'>
                          Mechanical Engineer
                        </SelectItem>
                        <SelectItem value='Professor'>Professor</SelectItem>
                        <SelectItem value='Doctor'>Doctor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name='mobileNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder='9876543210' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder='Chennai, Tamil Nadu' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name='resume'
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Resume</FormLabel>
                    <FormControl className='cursor-pointer'>
                      <div className='flex items-center relative'>
                        <Input
                          type='file'
                          placeholder='Resume'
                          accept='.pdf,.docx'
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                          className='cursor-pointer file:text-zinc-900 dark:file:text-zinc-100 file:font-bold'
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className=' mt-4'>
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
