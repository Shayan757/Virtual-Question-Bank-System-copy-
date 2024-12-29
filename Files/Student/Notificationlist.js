
'use client'


import { useContext, useEffect, useState } from 'react';
import AdminContext from '../../Context/AdminContext';
import { Bell } from 'lucide-react';

const NotificationList = () => {
  const { notifications, fetchNotifications, markNotificationAsRead } = useContext(AdminContext);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchNotifications();
    }
  }, []);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className="fixed top-5 right-12 z-50 p-4">
      <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={toggleModal}>
        <Bell className="w-6 h-6 text-yellow-600 hover:bg-yellow-200" />
        {/* <h2 className="text-xl font-semibold">Notifications</h2> */}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <ul className="space-y-4">
              {Array.isArray(notifications) && notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className={`p-4 rounded-md border ${notification.isRead ? 'bg-gray-100' : 'bg-yellow-100'}`}
                  >
                    <h3 className="text-lg font-medium">{notification.title}</h3>
                    <p className="text-sm mt-1">{notification.message}</p>
                    {!notification.isRead && (
                      <button
                        onClick={() => markNotificationAsRead(notification._id)}
                        className="mt-2 inline-block text-blue-500 hover:underline"
                      >
                        Mark as Read
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No notifications available</p>
              )}
            </ul>
            <button
              onClick={toggleModal}
              className="mt-4 py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
