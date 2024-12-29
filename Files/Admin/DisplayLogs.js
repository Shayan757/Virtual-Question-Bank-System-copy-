
'use client'

import React, { useContext, useEffect, useState } from 'react';
import AdminContext from '../../Context/AdminContext';

const Logs = () => {
    const [engagementLogs, setEngagementLogs] = useState([]);
    const { getEngagementLogs } = useContext(AdminContext);    
    const [showLogs, setShowLogs] = useState(false);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const logs = await getEngagementLogs();
                setEngagementLogs(logs);
                setShowLogs(true);
            } catch (error) {
                console.error('Error fetching engagement logs:', error);
            }
        };
        
        fetchLogs();
    }, []);

    return (
        <div className="bg-gray-100 p-4 mt-4 rounded">
            {showLogs && engagementLogs && engagementLogs.length > 0 ? (
                <div>
                    {engagementLogs.map((log, index) => (
                        <div key={log._id} className="mb-6 p-4 border border-gray-300 rounded">
                            <p className='text-amber-800'><strong>Action:</strong> {log.action}</p>
                            <p className='text-amber-800'><strong>Time Spent:</strong> {log.timeSpent} seconds</p>
                            <p className='text-amber-800'><strong>Date:</strong> {new Date(log.date).toLocaleString()}</p>
                            <p className='text-amber-800'><strong>Session ID:</strong> {log.sessionId}</p>
                            <p className='text-amber-800'><strong>Student ID:</strong> {log.studentId}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No engagement logs available.</p>
            )}
        </div>
    );
};

export default Logs;
