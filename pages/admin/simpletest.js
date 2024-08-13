// pages/admin/questions.js
import Sidebar from '../../Files/Admin/Sidebar';
import Header from '../../Files/Admin/Header';
import SimpleTest from '../../Files/Admin/SimpleTest';

const simpleTest = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-grow p-4">
                <Header />
                <SimpleTest />
            </div>
        </div>
    );
};

export default simpleTest;
