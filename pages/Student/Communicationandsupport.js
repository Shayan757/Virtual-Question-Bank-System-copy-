import React from 'react'
import Header from 'Files/Student/Header'
import Sidebar from 'Files/Student/Sidebar'
import CommunicationAndSupport from 'Files/Student/CommunicationAndSupport'
import Footer from 'Files/Student/Footer'

const Communicationandsupport = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className='flex flex-1'>
            <Sidebar/>
            <div className="flex-grow p-4">
                <Header />
                <CommunicationAndSupport/>
            </div>
            </div>
          <Footer/>
        </div>
  )
}

export default Communicationandsupport
