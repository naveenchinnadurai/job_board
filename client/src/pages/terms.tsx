import { Link } from 'react-router-dom'
import { LogoWithText } from '../components/logo'
import { ThemeToggle } from '../components/theme-toggle'
import { ArrowLeft } from 'lucide-react'

export default function Terms() {
  return (
    <>
      <Link
        to='/'
        className='absolute left-8 top-8 flex items-center gap-2 text-sm font-medium px-4 py-2 border border-zinc-800 rounded-md hover:bg-zinc-800'>
        <ArrowLeft size={16} />
        Home
      </Link>
      <div className='absolute right-8 top-8 flex items-center gap-2'>
        <ThemeToggle />
      </div>
      <div className='flex h-svh w-svw items-center justify-center p-8'>
        <div className='flex max-w-[600px] flex-col gap-4'>
          <LogoWithText width={120} className='mb-4' />
          <h1 className='text-2xl font-bold'>Terms & Conditions</h1>
          <p className='mb-3'>
            Welcome to our Job Board website. By accessing and using our
            website, you agree to comply with and be bound by the following
            terms and conditions. Our platform provides job listing services for
            both employers and job seekers. All users must ensure that the
            information they provide is accurate and up-to-date. Employers are
            responsible for ensuring that their job postings are lawful and do
            not violate any regulations or third-party rights. Job seekers must
            not use the website for any fraudulent purposes, including
            submitting false information or applying for jobs they are not
            qualified for.
          </p>
          <p>
            Our website reserves the right to remove any content or user
            accounts that are found to be in violation of these terms. We do not
            guarantee the availability or accuracy of job listings and are not
            responsible for any employment decisions made based on the
            information provided on our site. By using our services, you agree
            to indemnify and hold us harmless from any claims or damages
            resulting from your use of the website. These terms and conditions
            may be updated periodically, and it is your responsibility to review
            them regularly. Your continued use of the website constitutes
            acceptance of any changes.
          </p>
        </div>
      </div>
    </>
  )
}
