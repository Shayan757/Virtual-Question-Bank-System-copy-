

'use client'


import React, { useEffect, useState, useContext } from 'react';
import AdminContext from '../../Context/AdminContext';


const PerformanceMetrics = ({ sessionId, questionIds }) => {
    const [performanceMetrics, setPerformanceMetrics] = useState(null);
    const [questionUsage, setQuestionUsage] = useState(null);
    const { getMetrics, fetchUsageCount } = useContext(AdminContext);

    useEffect(() => {
        console.log("Received sessionId in Metrics:", sessionId); // Log sessionId to verify
        console.log("Received questionIds in Metrics:", questionIds); // Log questionIds to verify

        const loadData = async () => {
            if (!sessionId) {
                console.error("No sessionId provided");
                return;
            }
            
            try {
                const metrics = await getMetrics(sessionId);
                setPerformanceMetrics(metrics);

                if (questionIds && questionIds.length > 0) {
                    const usageMetricsPromises = questionIds.map(id => fetchUsageCount(id)); // Fetch usage for each question ID
                    const usageMetrics = await Promise.all(usageMetricsPromises); // Wait for all promises to resolve
                    setQuestionUsage(usageMetrics); // Set the results in state
                }
            } catch (error) {
                console.error('Error loading data in Metrics:', error);
            }
        };

        loadData(); // Call loadData within useEffect
    }, [getMetrics, fetchUsageCount, questionIds, sessionId]); // Add dependencies to re-run when questionIds changes

    return (
        <div>
            {/* Render performance metrics */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold text-blue-300 mb-2">Performance Metrics</h3>
                {performanceMetrics ? (
                    <div>
                        <p className='text-amber-800'><strong>Session ID:</strong> {performanceMetrics.sessionId}</p>
                        <p className='text-amber-800'><strong>Student ID:</strong> {performanceMetrics.studentId}</p>
                        <p className='text-amber-800'><strong>Correct Answers:</strong> {performanceMetrics.correctAnswers}</p>
                        <p className='text-amber-800'><strong>Incorrect Answers:</strong> {performanceMetrics.incorrectAnswers}</p>
                        <p className='text-amber-800'><strong>Average Time per Question:</strong> {performanceMetrics.averageTimePerQuestion} seconds</p>
                        <p className='text-amber-800'><strong>Total Score:</strong> {performanceMetrics.totalScore}</p>
                        <p className='text-amber-800'><strong>Date:</strong> {new Date(performanceMetrics.date).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <p>Loading performance metrics...</p>
                )}
            </div>

            {/* Render question usage metrics */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold text-blue-300 mb-2">Question Usage Metrics</h3>
                {questionUsage ? (
                    questionUsage.map((usage, index) => (
                        <div key={index}>
                            <p className='text-purple-400'><strong>Usage Count:</strong> {usage.usageCount}</p>
                            <p className='text-lime-600'><strong>Question Text:</strong> {usage.questionText}</p>
                        </div>
                    ))
                ) : (
                    <p>Loading question usage metrics...</p>
                )}
            </div>
        </div>
    );
};

export default PerformanceMetrics;
