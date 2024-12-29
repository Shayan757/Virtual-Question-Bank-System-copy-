'use client'


import React, { useState, useEffect } from 'react';
import Logs from './DisplayLogs';
import Spinner from '../Student/loader'; // Import the spinner component

const Engagements = () => {
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading for 2 seconds
    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-300">Engagements</h2>
      <Logs />
    </div>
  );
};

export default Engagements;
