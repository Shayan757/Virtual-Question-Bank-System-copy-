
'use client'

import { useContext, useEffect, useState } from 'react';
import AdminContext from '../../Context/AdminContext';
import Spinner from "../Student/loader"
import { Pencil } from 'lucide-react';
import { Trash } from 'lucide-react';



const Modal = ({ isOpen, onClose, onSave, user }) => {
    if (!isOpen) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedData = {
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value,
            roles: event.target.roles.value,
        };
        onSave(user._id, updatedData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Update User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input defaultValue={user.name} name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input defaultValue={user.email} name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input defaultValue={user.password} name="password" type="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                        <input defaultValue={user.roles} name="roles" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Users = () => {
    const { users, fetchUsers, updateUsers, deleteUsers, } = useContext(AdminContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Set the spinner to hide after 5 seconds
        const timer = setTimeout(() => {
          setLoading(false)
        }, 2000);
    
        return () => clearTimeout(timer); // Cleanup the timer
      }, []);

      

    const handleUpdate = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleSave = async (id, updatedData) => {
        try {
            await updateUsers(id, updatedData);
            fetchUsers(); // Re-fetch to ensure UI is up to date
        } catch (error) {
            console.error('Error updating user:', error);
        }
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        deleteUsers(id);
    };

   

    return (
        <div className='p-6 mt-7 '>


            <h2 className="text-xl text-blue-300 font-bold mb-4">User Management</h2>


            <table className="table-auto w-full shadow-md bg-white border-collapse border border-gray-200">
            {loading ? (
        // Spinner container with centering
        <div className="flex justify-center items-center absolute inset-0">
          <Spinner />
        </div>
      ) : (

        <>
        
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-3 px-6 border-b text-left">Name</th>
                        <th className="py-3 px-6 border-b text-left">Email</th>
                        {/* <th className="py-3 px-6 border-b text-left">Password</th> */}
                        <th className="py-3 px-10 border-b text-left">Role</th>
                        <th className="py-3 px-10 border-b text-left">Actions</th>
                    </tr>
                </thead>
               

                <tbody>
                    {Array.isArray(users) && users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-100">
                                <td className="py-3 px-6 border-b">
                                    <span
                                        className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
                                        style={{ backgroundColor: "#DBEAFE" }} // Light blue background as a fallback
                                    >
                                        {user.name}
                                    </span>
                                </td>
                                {/* Email */}
                                <td className="py-3 px-6 border-b">
                                    <span
                                        className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800"
                                        style={{ backgroundColor: "#D1FAE5" }} // Light green background as a fallback
                                    >
                                        {user.email}
                                    </span>
                                </td>
                                <td className="py-3 px-10 border-b">
                                    <span
                                        className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-800"
                                        style={{ backgroundColor: "#FEF3C7" }} // Light yellow background as a fallback
                                    >
                                        {user.roles}
                                    </span>
                                </td>
                                <td className="py-3 px-6 border-b text-center">
                                    <div className="flex items-center px-8 py-4">
                                        <Pencil
                                            size={"16px"}
                                            className="mr-1 text-blue-500 cursor-pointer hover:text-blue-700"
                                            onClick={() => handleUpdate(user)}
                                        />
                                        <Trash
                                            size={"16px"}
                                            className="mr-1 text-red-500 cursor-pointer hover:text-red-700"
                                            onClick={() => handleDelete(user._id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-3 px-6 text-center">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
        </>    
      )}
            </table>




            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                user={selectedUser}
            />
         
        </div>
    );
};

export default Users;
