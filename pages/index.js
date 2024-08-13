import { Inter } from "next/font/google";
import Navbar from "../Components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>

    <Navbar/>
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
    >
      <h1 className="text-4xl font-bold">
        Welcome To Virtual Question Bank System
      </h1>
    </main>
    </>
    
  );
}
