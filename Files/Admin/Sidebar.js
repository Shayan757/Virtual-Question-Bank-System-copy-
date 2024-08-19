// components/Admin/Sidebar.js
import Link from 'next/link';
import Logout from './Logouts';

const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
            <ul className="list-none p-0">
                <li className="mb-2">
                    <Link href="/admin/admindashboard" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:text-primary`'>
                        Dashboard
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/user" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:text-primary`' >
                        Users
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/question" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:text-primary`'>
                        Questions
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/analytic" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:text-primary`'>
                        Analytics
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/logout" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:text-primary`'>
                        <Logout/>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
