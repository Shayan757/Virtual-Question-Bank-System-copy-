'use client'

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-indigo-500 p-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* Left side links */}
          <div className="flex space-x-4">
            <Link href="/" className="text-white px-3 py-2 rounded-md text-sm font-medium  hover:bg-teal-400">
              Home
            </Link>
            <Link href="/about" className="text-white px-3 py-2 rounded-md text-sm font-medium  hover:bg-teal-400">
              About
            </Link>
          </div>
          {/* Right side links */}
          <div className="flex space-x-4 ml-auto">
            <Link href="/register" className="text-white px-3 py-2 rounded-md text-sm font-medium  hover:bg-red-400">
              Register
            </Link>
            <Link href="/login" className="text-white px-3 py-2 rounded-md text-sm font-medium  hover:bg-yellow-400">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
