import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { LogoWithText } from '../components/logo'
import { ThemeToggle } from '../components/theme-toggle'
import { Button } from '../components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

const registerFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).max(32, { message: 'Password can be 32 characters maximum' }),
  userType: z.enum(['employer', 'employee'], {
    required_error: 'Please select a user type',
  }),
})

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    console.log(values)
    const { email, password, userType } = values
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/signup', {
        email,
        password,
        userType
      })
      console.log(res)
      if (!res.data.isSuccess) {
        console.log(res.data.message)
        return;
      }
      console.log(res.data.message)
      const { accessToken, refreshToken } = res.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      console.log(userType)
      if (userType === "employee") {
        navigate('/onboarding/employee')
      } else {
        navigate('/onboarding/employer')
      }
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
          <h1 className='text-2xl font-bold'>Create your Job Board account</h1>
          <p className='mb-3'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-500'>
              Sign in
            </Link>
            .
          </p>
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onSubmit)}
              className='flex flex-col gap-4'>
              <FormField
                control={registerForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='john.doe@example.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder='••••••••••••'
                          {...field}
                        />
                        <button
                          type='button'
                          className='absolute right-3 top-[44px] -translate-y-1/2 transform'
                          onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name='userType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What are you looking for? to</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select your user type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='employer'>Hire</SelectItem>
                        <SelectItem value='employee'>Get job</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='mt-4'>
                Create account
              </Button>
            </form>
          </Form>
          <p className='mt-4 text-sm'>
            By signing up, you agree to our{' '}
            <Link to={`/terms`} className='text-blue-500'>
              terms
            </Link>
            , {'and '}
            <Link to={`/privacy`} className='text-blue-500'>
              privacy policy
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
