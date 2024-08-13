// pages/admin/questions.js
import Sidebar from '../../Files/Admin/Sidebar';
import Header from '../../Files/Admin/Header';
import Questions from '../../Files/Admin/Questions';

const AdminQuestions = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-grow p-4">
                <Header />
                <Questions />
            </div>
        </div>
    );
};

export default AdminQuestions;
