'use client'

import { useEffect, useState } from 'react';
import MessageBox from './Messagebox';
import NotificationList from './Notificationlist';
import Spinner from './loader';
import Footer from './Footer';

const CommunicationAndSupport = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a network request or loading phase
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex justify-center items-center">
      {loading ? (
        <Spinner/>
      ) : (
        <div className="container mx-auto px-4 lg:px-8">
          {/* <h1 className="text-3xl font-bold mb-8 text-center">Support System</h1> */}
          
          {/* Notifications Section */}
          <div className="mb-20">
            {/* <h2 className="text-2xl font-semibold mb-4 text-center">Notifications</h2> */}
            <NotificationList />
          </div>

          {/* Messages Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">Messages</h2>
            <MessageBox />
          </div>
        </div>
      )}
    </div>
  );
  <Footer/>
};

export default CommunicationAndSupport;
