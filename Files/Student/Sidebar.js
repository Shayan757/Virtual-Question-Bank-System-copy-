
'use client'

import Link from 'next/link';
import { useRouter } from 'next/router';
import { CircleGauge, Flag, MessageCircle, History, CircleUserRound, Settings, LogOut } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import AdminContext from '../../Context/AdminContext';


const Sidebar = () => {
  const { getProfile } = useContext(AdminContext);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getProfile();
      setProfile(profileData);
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    
    localStorage.removeItem("token");
     
  
    router.push('/');
  };

  return (
    <div className="w-64 h-120 bg-indigo-500 text-white font-medium flex flex-col items-center pt-10">

      {/* Profile Picture and User Name */}
      <div className="flex flex-col items-center mt-4 mb-10">
        {profile?.profilePicture ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${profile.profilePicture}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-gray-300 mb-2">
            No Image
          </div>
        )}
        <p className="text-lg font-semibold text-center">{profile?.username || 'User Name'}</p>
      </div>

      {/* Sidebar Links */}
      <ul className="list-none p-0 w-full text-center">
        <li className="mb-3">
          <Link href="/Student/studentdashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400">
            <CircleGauge size={"16px"} /> Dashboard
          </Link>
        </li>
        <li className="mb-3">
          <Link href="/Student/Performanceanalysis" className="flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400">
            <Flag size={"16px"} /> Analysis
          </Link>
        </li>
        <li className="mb-3">
          <Link href="/Student/Communicationandsupport" className="flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400">
            <MessageCircle size={"16px"} /> Support
          </Link>
        </li>
        <li className="mb-3">
          <Link href="/Student/Messageshistory" className="flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400">
            <History size={"16px"} /> Your Messages
          </Link>
        </li>
        <li className="mb-3">
          <Link href="/Student/profileinfo" className="flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400">
            <CircleUserRound size={"16px"} /> Account Information
          </Link>
        </li>
        <li className="mb-3">
          <Link href="/Student/Setting" className="flex items-center gap-3 rounded-lg px-3 py-2 text-offwhite transition-all hover:bg-teal-400">
            <Settings size={"16px"} /> Settings
          </Link>
        </li>
        <li className="mb-2">
          <button
            className="flex items-center gap-3 rounded-2xl w-64 px-3 py-2 text-offwhite transition-all hover:bg-teal-400"
            onClick={handleLogout}
            
          >
            <LogOut size={"16px"} /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
