import { Link } from 'react-router-dom'
import { LogoWithText } from '../components/logo'
import { ThemeToggle } from '../components/theme-toggle'
import { ArrowLeft } from 'lucide-react'

export default function Privacy() {
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
          <h1 className='text-2xl font-bold'>Privacy Policy</h1>
          <p className='mb-3'>
            Your privacy is important to us. This Privacy Policy outlines how we
            collect, use, disclose, and safeguard your information when you
            visit our Job Board website. We collect personal information such as
            your name, email address, and resume details when you register,
            apply for jobs, or post job listings. This information is used to
            provide you with our services, improve your user experience, and
            communicate with you about relevant job opportunities and site
            updates. We may also use aggregated data for analytical purposes to
            enhance our website's functionality.
          </p>
          <p>
            We implement various security measures to protect your personal
            information from unauthorized access, disclosure, or alteration.
            However, no method of transmission over the internet or electronic
            storage is completely secure, and we cannot guarantee absolute
            security. We do not sell, trade, or otherwise transfer your personal
            information to outside parties without your consent, except as
            required by law or to trusted third parties who assist us in
            operating our website and conducting our business, provided they
            agree to keep this information confidential. By using our website,
            you consent to the terms of this Privacy Policy. We may update this
            policy from time to time, and we encourage you to review it
            regularly.
          </p>
        </div>
      </div>
    </>
  )
}
