// pages/admin/questions.js
import Sidebar from '../../Files/Admin/Sidebar';
import Header from '../../Files/Admin/Header';
import Questions from '../../Files/Admin/Questions';
import Footer from 'Files/Student/Footer';

const AdminQuestions = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className='flex flex-1'>
            <Sidebar />
            <div className="flex-grow p-4">
                <Header />
                <Questions />
            </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminQuestions;
