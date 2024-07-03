import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LogoWithText } from '../components/logo'
import { ThemeToggle } from '../components/theme-toggle'
import { Button } from '../components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import api from '../lib/api'

export default function CompanyOnBoarding() {
  const companyFormSchema = z.object({
    name: z.string().min(1, { message: 'Company name cannot be empty' }),
    location: z.string().min(1, { message: 'Location is required' }),
    mobileNumber: z.string().regex(/^[0-9]{10}$/, { message: 'Invalid mobile number' }),
    sector: z.enum(['IT', 'Mechanical', 'Finance', 'Education', 'HealthCare'], {
      required_error: 'Please select a company sector.',
    }),
  })

  const companyForm = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      location: '',
      mobileNumber: '',
    },
  })

  async function onSubmit(values: z.infer<typeof companyFormSchema>) {
    console.log(values)
    const res=await api.put('/employer/profile',{
      
    })
  }
  return (
    <>
      <div className='absolute right-8 top-8 flex items-center gap-2'>
        <ThemeToggle />
      </div>
      <div className='flex h-svh w-svw items-center justify-center'>
        <div className='flex min-w-[400px] flex-col gap-4'>
          <LogoWithText width={120} className='mb-4' />
          <h1 className='text-2xl font-bold mb-2'>Company details</h1>
          <Form {...companyForm}>
            <form
              onSubmit={companyForm.handleSubmit(onSubmit)}
              className='flex flex-col gap-4'>
              <FormField
                control={companyForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Job Board' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
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
                control={companyForm.control}
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
                control={companyForm.control}
                name='sector'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select Industry' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='IT'>
                          Information Technology
                        </SelectItem>
                        <SelectItem value='Mechanical'>Mechanical</SelectItem>
                        <SelectItem value='Finance'>Finance</SelectItem>
                        <SelectItem value='Education'>Education</SelectItem>
                        <SelectItem value='HealthCare'>Health Care</SelectItem>
                      </SelectContent>
                    </Select>
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
