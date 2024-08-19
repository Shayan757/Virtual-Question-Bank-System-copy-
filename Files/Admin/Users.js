




import { useContext, useEffect, useState } from 'react';
import AdminContext from '../../Context/AdminContext';
import { TrashIcon, Pencil1Icon } from '@radix-ui/react-icons'; // Import icons


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
    const { users, fetchUsers, updateUsers, deleteUsers, fetchUserActivity } = useContext(AdminContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
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

    // const handleViewActivity = (id) => {
    //     fetchUserActivity(id);
    // };

    return (
        <div className='p-4'>
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-7">Name</th>
                        <th className="py-2 px-7">Email</th>
                        <th className="py-2 pl-2">Password</th>
                        <th className="py-2 px-7">Role</th>
                        {/* <th className="py-2">Actions</th> */}
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(users) && users.length > 0 ? (
                        users.map(user => (
                            <tr key={user._id}>
                                <td className="py-2 px-7">{user.name}</td>
                                <td className="py-2 px-7">{user.email}</td>
                                <td className="py-2 pl-2">{user.password}</td>
                                <td className="py-2 px-7">{user.roles}</td>
                                <td className="py-2">
                                <button onClick={() => handleUpdate(user)} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded flex items-center">
                                        <Pencil1Icon className="mr-1" /> 
                                </button>
                                <button onClick={() => handleDelete(user._id)} className="mr-2 bg-red-500 text-white px-4 py-2 rounded flex items-center">
                                        <TrashIcon className="mr-1" />
                                    </button>
                                    {/* <button onClick={() => handleViewActivity(user._id)} className="bg-green-500 text-white px-4 py-2 rounded">
                                        View Activity
                                    </button> */}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-2 text-center">No users found</td>
                        </tr>
                    )}
                </tbody>
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
