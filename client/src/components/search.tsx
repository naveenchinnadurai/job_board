import { SearchIcon } from 'lucide-react';

import { Input } from './ui/input';

function Search() {
    return (
        <div className='w-fit relative '>
            <Input type="text" placeholder="Search" className='w-72 focus-visible:ring-gray-900 focus-visible:ring-1 focus-visible:ring-offset-1 ' />
            <SearchIcon size={17} className='absolute top-3 right-3 text-gray-500' />
        </div>
    )
}

export default Search
