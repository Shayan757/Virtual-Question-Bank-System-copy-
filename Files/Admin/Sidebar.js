// components/Admin/Sidebar.js

'use client'

import Link from 'next/link';

import { useRouter } from 'next/router';
import { CircleGauge } from 'lucide-react';
import { UserMinus } from 'lucide-react';
import { ShieldQuestion } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { ChartNoAxesColumnDecreasing } from 'lucide-react';
import { Logs } from 'lucide-react';


const Sidebar = () => {

    const router = useRouter();

  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem("token");

    // Redirect to the home page
    router.push('/');
  };


    return (
        <div className="w-64 h-120 bg-indigo-500 text-white font-medium flex flex-col items-center pt-10">
            <ul className="list-none p-0 w-full text-center mt-11">
                <li className="mb-3">
                    <Link href="/admin/admindashboard" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400  `'>
                 <CircleGauge size={"16px"}/> Dashboard       
                    </Link>
                </li>
                <li className="mb-3">
                    <Link href="/admin/user" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400 `' >
                    <UserMinus size={"16px"}/> Users
                    </Link>
                </li>
                <li className="mb-3">
                    <Link href="/admin/question" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400 `'>
                    <ShieldQuestion size={"16px"}/> Questions
                    </Link>
                </li>
                <li className="mb-3">
                    <Link href="/admin/analytic" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400 `' >
                    <ChartNoAxesColumnDecreasing size={"16px"}/>  Analytics
                    </Link>
                </li>

                <li className="mb-3">
                    <Link href="/admin/adminresponse" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400 `'>
                    <MessageCircle size={"16px"}/> Support
                    </Link>
                </li>

                <li className="mb-3">
                    <Link href="/admin/engagement" className='flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400 `'>
                    <Logs size={"16px"}/> Engagements
                    </Link>
                </li>
                

              <li className="mb-2">
                    <button className='flex items-center gap-3 rounded-2xl w-64 px-3 py-2 text-offwhite transition-all hover:bg-teal-400 `' onClick={handleLogout}>
                    <LogOut size={"16px"}/>  Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
