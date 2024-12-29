

import { Inter } from "next/font/google";
import { useEffect, useState } from 'react';
import Navbar from "../Components/Navbar";
import Image from "next/image";
import logo from "../public/Question-Bank.png";
import Spinner  from '../Files/Student/loader';
import Footer from "../Files/Student/Footer"


const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar />
      <main
        className={`flex min-h-screen bg-gray-100 flex-col md:flex-row items-center justify-between p-10 ${inter.className}`}
      >
         {loading ? (
          <div className="flex items-center justify-center w-full h-full min-h-screen">
            <Spinner/>
          </div>
        ) : (
          <>
            {/* Text Content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="text-4xl font-bold text-cyan-500">
                <div className="typing-effect">Welcome To</div>
                <div className="typing-effect mt-2">Virtual Question Bank System</div>
              </div>
            </div>

            {/* Image on the right */}
            <div className="mt-8 md:mt-0 md:ml-8">
              <Image
                src={logo}
                alt="Logo"
                width={300} // Adjust the size as needed
                height={300}
                priority
              />
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
