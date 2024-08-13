import React from 'react'
import Navbar from '../Components/Navbar'

const about = () => {
  return (
    <>
    <Navbar />
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">About Us</h1>
      <p className="mt-4 text-lg">This is the About page.</p>
    </main>
  </>
  )
}

export default about
