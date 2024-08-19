// pages/admin/questions.js
import Sidebar from '../../Files/Admin/Sidebar';
import Header from '../../Files/Admin/Header';
import Logout from '../../Files/Admin/Logouts';

const logout = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-grow p-4">
                <Header />
                <Logout/>
            </div>
        </div>
    );
};

export default logout;
