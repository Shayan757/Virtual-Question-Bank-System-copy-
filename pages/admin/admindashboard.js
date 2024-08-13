
import Sidebar from '../../Files/Admin/Sidebar';
import Header from '../../Files/Admin/Header';
import Dashboard from '../../Files/Admin/Dashboard';

const AdminHome = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-grow p-4">
                <Header />
                <Dashboard />
            </div>
        </div>
    );
};

export default AdminHome;
