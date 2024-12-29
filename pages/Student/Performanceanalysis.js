
import Header from 'Files/Student/Header';

import Sidebar from 'Files/Student/Sidebar';
import Performance from 'Files/Student/PerformanceAnalysis';
import Footer from 'Files/Student/Footer';

const Performanceanalysis = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className='flex flex-1'>
            <Sidebar/>
            <div className="flex-grow p-4">
                <Header />
                <Performance/>
            </div>

            </div>
            <Footer/>
        </div>
    );
};

export default Performanceanalysis;
