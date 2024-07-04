import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../auth/AuthContext'
import { LogoWithText } from '../components/logo'
import { ThemeToggle } from '../components/theme-toggle'
import { Button } from '../components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import { Input } from '../components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).max(64, { message: 'Password can be 64 characters maximum' }),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    try {
      await login(values.email, values.password)
      console.log('Logged in successfully')
      if (type === "employee") {
        navigate('/dashboard/employee')
      } else if (type === "employer") {
        navigate('/dashboard/employer')
      }
    } catch (error) {
      console.error('Login error:', error)
      console.log('Failed to log in. Please check your credentials.')
    } finally {
      setIsLoading(false)
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
          <h1 className='text-2xl font-bold'>Sign into Job Board account</h1>
          <p className='mb-3'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-blue-500'>
              Sign up
            </Link>
            .
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-4'>
              <FormField
                control={form.control}
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
                control={form.control}
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

              <Button type='submit' className='mt-4' disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>
          <p className='mt-4 text-sm'>
            By signing in, you agree to our{' '}
            <Link to={`/terms`} className='text-blue-500'>
              terms
            </Link>
            , and{' '}
            <Link to={`/privacy`} className='text-blue-500'>
              privacy policy
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
