
import Header from 'Files/Files/Header';

import Sidebar from 'Files/Files/Sidebar';
import Dashboard from 'Files/Files/StudentDashboard';

const StudentHome = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="flex-grow p-4">
                <Header />
                <Dashboard/>
            </div>
        </div>
    );
};

export default StudentHome;
