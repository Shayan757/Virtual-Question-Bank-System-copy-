'use client'

import React, { useEffect, useState, useContext } from 'react';
import Metrics from './PerformanceMetrics';
import AdminContext from '../../Context/AdminContext';
import Spinner from "../Student/loader";

const Analytics = ({ sessionId: propSessionId }) => {
  const [sessionId, setSessionId] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const { fetchLatestSessionId, fetchQuestionIds } = useContext(AdminContext);

  useEffect(() => {
    const loadAnalyticsData = async () => {
    

      if (propSessionId) {
        setSessionId(propSessionId);
        console.log('Using propSessionId:', propSessionId);
      } else {
        const latestSessionId = await fetchLatestSessionId();
        console.log('Fetched latest session ID:', latestSessionId);
        if (latestSessionId) setSessionId(latestSessionId);
      }

      if (!questionId || questionId.length === 0) {
        const fetchedQuestionIds = await fetchQuestionIds();
        console.log('Fetched question IDs:', fetchedQuestionIds);
        if (fetchedQuestionIds.length > 0) setQuestionId(fetchedQuestionIds);
      }

      // Ensure the spinner displays for at least 5 seconds
      setTimeout(() => {
        setLoading(false); // Stop loading
      }, 2000);
    };

    loadAnalyticsData();
  }, [propSessionId, fetchLatestSessionId, fetchQuestionIds, questionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!sessionId) {
    return <div>No session data...</div>;
  }

  return (
    <div>
      <Metrics sessionId={sessionId} questionIds={questionId} />
    </div>
  );
};

export default Analytics;
