'use client'

import React, { useEffect, useState, useContext } from 'react';
import ScoreDistributionChart from './Scorechart';
import QuestionAnalysis from './QuestionAnalysis';
import AdminContext from '../../Context/AdminContext';
import Spinner from "../Student/loader";

const AdminDashboard = ({ sessionId: propSessionId }) => {
    const { fetchLatestSessionId, fetchQuestionIds } = useContext(AdminContext);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [questionIds, setQuestionIds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            

            if (propSessionId) {
                setCurrentSessionId(propSessionId);
                console.log('Using propSessionId:', propSessionId);
            } else {
                const latestSessionId = await fetchLatestSessionId();
                console.log('Fetched latest session ID:', latestSessionId);
                if (latestSessionId) setCurrentSessionId(latestSessionId);
            }

            const latestQuestionIds = await fetchQuestionIds();
            console.log('Fetched latest question IDs:', latestQuestionIds);
            setQuestionIds(latestQuestionIds);

            // Ensure the spinner displays for at least 5 seconds
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        };

        loadDashboardData();
    }, [propSessionId, fetchLatestSessionId, fetchQuestionIds]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div>
            <ScoreDistributionChart sessionId={currentSessionId} />
            <QuestionAnalysis questionIds={questionIds} />
        </div>
    );
};

export default AdminDashboard;
