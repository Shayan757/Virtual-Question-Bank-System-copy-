// pages/admin/analytics.js
import Sidebar from '../../Files/Admin/Sidebar';
import Header from '../../Files/Admin/Header';
import Analytics from '../../Files/Admin/Analytics';

const AdminAnalytics = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-grow p-4">
                <Header />
                <Analytics />
            </div>
        </div>
    );
};

export default AdminAnalytics;
