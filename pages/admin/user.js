// pages/admin/users.js
import Sidebar from '../../Files/Admin/Sidebar';
import Header from '../../Files/Admin/Header';
import Users from '../../Files/Admin/Users';
import Footer from 'Files/Student/Footer';

const AdminUsers = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className='flex flex-1'>
            <Sidebar />
            <div className="flex-grow p-4">
                <Header />
                <Users />
            </div>
            </div>
           <Footer/>
        </div>
    );
};

export default AdminUsers;
