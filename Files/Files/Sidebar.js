// components/Admin/Sidebar.js
import Link from 'next/link';
// import Logout from './Logouts';

const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
            <ul className="list-none p-0">
                <li className="mb-2">
                    <Link href="/Student/studentdashboard" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:text-primary`'>
                        Dashboard
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/Student/profile" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:text-primary`'>
                        Profile
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/Student/Performanceanalysis" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:text-primary`'>
                        Performence Analysis
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/Student/Communicationandsupport" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:text-primary`'>
                        Communication And Support
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/Student/logouts" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:text-primary`'>
                        {/* <Logout/> */}
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
