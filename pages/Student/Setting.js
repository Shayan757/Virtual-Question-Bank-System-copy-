import Header from 'Files/Student/Header';

import Sidebar from 'Files/Student/Sidebar';
import Profile from 'Files/Student/Profile';
import Footer from 'Files/Student/Footer';

const Setting = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
         <div className='flex flex-1'>
         <Sidebar/>
            <div className="flex-grow p-4">
                <Header />
                <Profile/>
            </div>

            </div>

            <Footer/>
      </div>
  )
}

export default Setting
