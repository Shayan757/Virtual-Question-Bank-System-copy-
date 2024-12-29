'use client'


import { useContext, useEffect, useState } from 'react';
import AdminContext from '../../Context/AdminContext';
import Notification from './Notification'; // Import the Notification component
import Spinner from '../Student/loader'; // Import the spinner component
import { MessageCircleReply } from 'lucide-react';


const AdminMessageResponse = () => {
  const { messages, fetchAdminMessages, sendAdminResponse, sendNotification } = useContext(AdminContext);

  const [selectedMessage, setSelectedMessage] = useState(null); // Store the selected message object
  const [adminResponse, setAdminResponse] = useState('');
  const [loading, setLoading] = useState(true); // Spinner for loading state
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  useEffect(() => {
    const loadMessages = async () => {
      await fetchAdminMessages();
      
    };
    loadMessages();
  }, []);


  useEffect(() => {
        
        const timer = setTimeout(() => {
          setLoading(false)
        }, 2000);
    
        return () => clearTimeout(timer); // Cleanup the timer
      }, []);
    

  const toggleModal = (message = null) => {
    setSelectedMessage(message);
    setShowModal(!showModal);
  };

  const handleSendResponse = async () => {
  
    if (selectedMessage) {
      await sendAdminResponse(selectedMessage._id, adminResponse);
    }
    setAdminResponse(''); // Clear input field
    toggleModal(); // Close modal
  
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 lg:px-8">
    

        {/* List of user messages */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">User Messages</h2>
          <ul className="space-y-4">
            {messages.map((message) => (
              <li
                key={message._id}
                className={`p-4 rounded-md text-gray-500 hover:bg-yellow-100 border ${message.isAdminResponse ? 'bg-white' : 'bg-yellow-400'}`}
              >
                <h3 className="text-lg font-medium text-gray-500">
                  {message.isAdminResponse ? 'Admin Response' : 'User Message'}
                </h3>
                <p className="text-sm mt-1">{message.message}</p>
                {message.adminResponse && (
                  <p className="mt-2 text-sm text-gray-500">Response: {message.adminResponse}</p>
                )}
                <button
                  className="mt-2 inline-block text-red-500 hover:underline"
                  onClick={() => toggleModal(message)}
                >
                  <MessageCircleReply />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal for Admin Response */}
        {showModal && selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-96 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Respond to User</h2>
              <p className="mb-4">{selectedMessage.message}</p>
              <textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Type your response here..."
                className="w-full h-24 p-2 border rounded-md mb-4"
              />
              <button
                onClick={handleSendResponse}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Send Response
              </button>
              <button
                onClick={() => toggleModal()}
                className="mt-4 py-2 px-4 w-full bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Notification Component */}
        <Notification sendNotification={sendNotification} />
      </div>
    </div>
  );
};

export default AdminMessageResponse;
