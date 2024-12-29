
'use client'


import { useContext, useEffect, useState } from 'react';
import AdminContext from '../../Context/AdminContext';
import  Spinner  from './loader';

const MessageHistory = () => {
  const { messages, fetchMessages } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      if (localStorage.getItem("token")) {
        await fetchMessages();
      }
    };
    loadMessages();
  }, [fetchMessages]);

  useEffect(() => {
    // Simulate a network request or loading phase
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      {loading ? (
        <Spinner/>
      ) : (
        <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Message History</h2>

          {/* Message History */}
          <div className="message-history h-64 overflow-y-auto border rounded-lg p-2 mb-4 bg-gray-100">
            {Array.isArray(messages) && messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className="my-2">
                  <div className="p-2 rounded-md bg-green-100 mb-1">
                    <p className="text-sm">User: {msg.message}</p>
                  </div>

                  {msg.adminResponse && (
                    <div className="p-2 rounded-md bg-blue-100 mt-1">
                      <p className="text-sm">Admin: {msg.adminResponse}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No messages yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageHistory;
