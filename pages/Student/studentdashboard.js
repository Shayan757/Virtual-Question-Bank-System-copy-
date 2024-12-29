import Header from 'Files/Student/Header';
import Sidebar from 'Files/Student/Sidebar';
import Dashboard from 'Files/Student/StudentDashboard';
import Footer from 'Files/Student/Footer';

const StudentHome = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Sidebar and Main Content */}
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-grow p-4">
                    <Header />
                    <Dashboard />
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default StudentHome;
