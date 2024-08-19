import React from 'react'
import Navbar from '../Components/Navbar'

const about = () => {
  return (
    <>
    <Navbar />
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">About Us</h1>
      <p className="mt-4 text-lg">

      The Virtual Question Bank System offers a comprehensive solution to streamline the examination preparation process for students and educators with the aims to enhance learning outcomes and academic performance. The Virtual Question Bank System is designed to provide a user-friendly platform for students to prepare comprehensively for their midterm and final term examinations. The system facilitates the storage, organization, and retrieval of multiple-choice questions (MCQs) and descriptive questions across various subjects. Administrators can efficiently manage question banks i.e input, manage, and organize exam questions, while users can view and practice these questions to enhance their exam preparation and self-assessment. 

      </p>
    </main>
  </>
  )
}

export default about
