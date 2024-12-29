import Sidebar from '../../Files/Admin/Sidebar';
import Header from '../../Files/Admin/Header';
import Response from '../../Files/Admin/AdminResponse';
import Footer from 'Files/Student/Footer';

const AdminResponse = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className='flex flex-1'>
            <Sidebar />
            <div className="flex-grow p-4">
                <Header />
                <Response/>
            </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminResponse;
