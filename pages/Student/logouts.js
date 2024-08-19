// pages/admin/questions.js
import Sidebar from '../../Files/Files/Sidebar';
import Header from '../../Files/Files/Header';
import Logout from '../../Files/Files/Logouts';

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
