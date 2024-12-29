// pages/admin/analytics.js
import Sidebar from '../../Files/Admin/Sidebar';
import Header from '../../Files/Admin/Header';
import Analytics from '../../Files/Admin/Analytics';
import Footer from 'Files/Student/Footer';

const AdminAnalytics = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className='flex flex-1'>
            <Sidebar />
            <div className="flex-grow p-4">
                <Header />
                <Analytics />
            </div>
            </div>

            <Footer/>
        </div>
    );
};

export default AdminAnalytics;
