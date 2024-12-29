
'use client'


import React, { useEffect, useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import AdminContext from '../../Context/AdminContext';

// Register all necessary Chart.js components
Chart.register(...registerables);

const ScoreChart = ({ sessionId }) => {
  const { fetchScoreDistribution } = useContext(AdminContext);

  const [scoreData, setScoreData] = useState({
    range0_10: 0,
    range11_20: 0,
    range21_30: 0,
    range31_40: 0,
    range41_50: 0,
    range51_60: 0,
    range61_70: 0,
    range71_80: 0,
    range81_90: 0,
    range91_100: 0,
    // range0_50: 0,
    // range51_75: 0,
    // range76_100: 0,
  });

  useEffect(() => {
    // Fetch score distribution data using the session ID
    const getScoreDistribution = async () => {
      const data = await fetchScoreDistribution(sessionId);
      console.log('Fetched score distribution:', data); // Debugging log

      if (data && data.scoreRanges) {
        // Create a new object to map the score ranges
        const mappedData = {
          range0_10: 0,
          range11_20: 0,
          range21_30: 0,
          range31_40: 0,
          range41_50: 0,
          range51_60: 0,
          range61_70: 0,
          range71_80: 0,
          range81_90: 0,
          range91_100: 0,

          // range0_50: 0,
          // range51_75: 0,
          // range76_100: 0,
        };

        // Map each range from the backend data to the appropriate predefined range
        data.scoreRanges.forEach((range) => {
          const [min, max] = range.range.split('-').map(Number); // Extract min and max from the range string
          const count = range.count;

          if (min >= 0 && max <= 10) mappedData.range0_10 += count;
          if (min >= 11 && max <= 20) mappedData.range11_20 += count;
          if (min >= 21 && max <= 30) mappedData.range21_30 += count;
          if (min >= 31 && max <= 40) mappedData.range31_40 += count;
          if (min >= 41 && max <= 50) mappedData.range41_50 += count;
          if (min >= 51 && max <= 60) mappedData.range51_60 += count;
          if (min >= 61 && max <= 70) mappedData.range61_70 += count;
          if (min >= 71 && max <= 80) mappedData.range71_80 += count;
          if (min >= 81 && max <= 90) mappedData.range81_90 += count;
          if (min >= 91 && max <= 100) mappedData.range91_100 += count;

          // if (min >= 0 && max <= 50) mappedData.range0_50 += count;
          // if (min >= 51 && max <= 75) mappedData.range51_75 += count;
          // if (min >= 76 && max <= 100) mappedData.range76_100 += count;

        });

        setScoreData(mappedData);
        console.log('Mapped score distribution:', mappedData); // Debugging log
      }
    };

    if (sessionId) {
      getScoreDistribution();
    }
  }, [sessionId, fetchScoreDistribution]);
  
  // Prepare data for the bar chart
  const chartData = {
    labels: [
      '0-10%',
      '11-20%',
      '21-30%',
      '31-40%',
      '41-50%',
      '51-60%',
      '61-70%',
      '71-80%',
      '81-90%',
      '91-100%',

      

    ],
    datasets: [
      {
        label: 'Number of Students',
        data: [
          scoreData.range0_10,
          scoreData.range11_20,
          scoreData.range21_30,
          scoreData.range31_40,
          scoreData.range41_50,
          scoreData.range51_60,
          scoreData.range61_70,
          scoreData.range71_80,
          scoreData.range81_90,
          scoreData.range91_100,
          // scoreData.range0_50,
          // scoreData.range51_75,
          // scoreData.range76_100,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-xl text-blue-300 font-bold mb-4">Score Distribution</h2>
      <div className="relative h-64">
        <Bar
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

export default ScoreChart;
