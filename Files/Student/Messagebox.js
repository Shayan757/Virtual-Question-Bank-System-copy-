
'use client'


import { useState, useContext } from 'react';
import { useRouter } from 'next/router'; // Assuming Next.js
import AdminContext from '../../Context/AdminContext';

const MessageBox = () => {
  const { sendMessage } = useContext(AdminContext);
  const [message, setMessage] = useState('');
  const router = useRouter(); // Next.js router

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
    }
  };

  

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Send a Message</h2>

      {/* Message Input */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="w-full h-24 p-2 border rounded-md mb-4"
      />

      
        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className="w-sm bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Send Message
        </button>

        
      </div>
    
  );
};

export default MessageBox;
