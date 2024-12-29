


// components/NotificationForm.js

'use client'


import { useState } from 'react';

const NotificationForm = ({ sendNotification }) => {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  const handleSendNotification = async () => {
    if (!studentId || !notificationTitle || !notificationMessage) {
      setError('All fields are required');
      return;
    }

    try {
      await sendNotification(studentId, notificationTitle, notificationMessage);
      setNotificationTitle('');
      setNotificationMessage('');
      setStudentId('');
      setError(''); // Clear error on successful send
    } catch (err) {
      setError('Failed to send notification');
    }
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-300">Send Notification</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        placeholder="Student Id"
        className="w-full p-2 border rounded-md mb-4"
      />
      <input
        type="text"
        value={notificationTitle}
        onChange={(e) => setNotificationTitle(e.target.value)}
        placeholder="Notification Title"
        className="w-full p-2 border rounded-md mb-4"
      />
      <textarea
        value={notificationMessage}
        onChange={(e) => setNotificationMessage(e.target.value)}
        placeholder="Notification Message"
        className="w-full h-24 p-2 border rounded-md mb-4"
      />
      <button
        onClick={handleSendNotification}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        Send Notification
      </button>
    </div>
  );
};

export default NotificationForm;
