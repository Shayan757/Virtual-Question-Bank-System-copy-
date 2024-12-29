import Header from 'Files/Student/Header';

import Sidebar from 'Files/Student/Sidebar';
import Profileinfo from 'Files/Student/PersonelInformation';
import Footer from 'Files/Student/Footer';

const profile = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

        <div className='flex flex-1'>
            <Sidebar/>
            <div className="flex-grow p-4">
                <Header />
                <Profileinfo/>
            </div>

            </div>

            <Footer/>
      </div>
  )
}

export default profile
