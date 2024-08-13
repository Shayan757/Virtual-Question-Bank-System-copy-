// components/Admin/Sidebar.js
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
            <ul className="list-none p-0">
                <li className="mb-2">
                    <Link href="/admin/admindashboard">
                        Dashboard
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/user">
                        Users
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/question">
                        Questions
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/analytic">
                        Analytics
                    </Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/simpletest">
                        SimpleTest
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
