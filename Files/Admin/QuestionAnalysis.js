

'use client'

// CombinedQuestionAnalysis.js
import React, { useEffect, useState, useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import AdminContext from '../../Context/AdminContext';

// Register Chart.js components
Chart.register(...registerables);

const QuestionAnalysis = ({ questionIds }) => {
    const { fetchQuestionAnalysis } = useContext(AdminContext);
    const [analysisData, setAnalysisData] = useState({ correct: 0, incorrect: 0 });

    useEffect(() => {
        const getQuestionAnalysis = async () => {
            let totalCorrect = 0;
            let totalIncorrect = 0;

            for (const questionId of questionIds) {
                const data = await fetchQuestionAnalysis(questionId);
                console.log('Fetched question analysis:', data); // Debugging log

                if (data && data.correctResponses !== undefined && data.incorrectResponses !== undefined) {
                    totalCorrect += data.correctResponses;
                    totalIncorrect += data.incorrectResponses;
                }
            }

            setAnalysisData({ correct: totalCorrect, incorrect: totalIncorrect });
        };

        if (questionIds.length > 0) {
            getQuestionAnalysis();
        }
    }, [questionIds, fetchQuestionAnalysis]);

    // Prepare data for the pie chart
    const chartData = {
        labels: ['Correct Responses', 'Incorrect Responses'],
        datasets: [
            {
                label: 'Combined Question Analysis',
                data: [analysisData.correct, analysisData.incorrect],
                backgroundColor: ['#4CAF50', '#FF6384'], // Green for correct, red for incorrect
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl text-blue-300 font-bold mb-4">Question Analysis</h2>
            <div className="relative h-64">
                <Pie
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                    }}
                />
            </div>
        </div>
    );
};

export default QuestionAnalysis;
