// pages/admin/users.js
import Sidebar from '../../Files/Admin/Sidebar';
import Header from '../../Files/Admin/Header';
import Users from '../../Files/Admin/Users';

const AdminUsers = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-grow p-4">
                <Header />
                <Users />
            </div>
        </div>
    );
};

export default AdminUsers;
