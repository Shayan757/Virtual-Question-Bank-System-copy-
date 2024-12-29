'use client'

import { useState, useEffect, useContext, useRef } from 'react';
import AdminContext from '../../Context/AdminContext';
import { RadioGroup, Radio } from '@headlessui/react'; // Updated import
import Performance from './PerformanceAnalysis'; // Import the Report component
import { useRouter } from 'next/router';
import { CheckCircleIcon } from '@heroicons/react/solid';



const PracticeSession = ({ sessionId, questions = [], timeLimit, title }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Time in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { submitPracticeAnswers, incrementUsage, logEngagement, saveScoreDistribution } = useContext(AdminContext);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeTaken, setTimeTaken] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [report, setReport] = useState(null);
  const router = useRouter();
  const hasLoggedEngagement = useRef(false);

  // This useEffect will handle logging engagement when the session starts
  useEffect(() => {
    if (!hasLoggedEngagement) {
      const engagementData = {
        action: 'start_practice', // Or other relevant actions like 'submit_answer', 'complete_session'
        timeSpent: 0,
        sessionId: sessionId, // Ensure sessionId is passed here
      };

      logEngagement(engagementData)
        .then(() => {
          hasLoggedEngagement.current = true; // Ensure we set this flag only after successful logging
        });
    }
  }, [logEngagement]);

  // This useEffect will manage the countdown timer and submission logic
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      // Clear the timer when component unmounts or when timeLeft changes
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isSubmitting) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitting]);

  // Increment question usage when moving to the next question
  useEffect(() => {
    if (questions.length > 0) {
      const questionId = questions[currentQuestion]._id;
      incrementUsage(questionId); // Increment usage count
    }
  }, [currentQuestion, questions]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.keys(answers).map(questionId => ({
        questionId,
        selectedAnswer: answers[questionId],
      }));

      const engagementData = {
        action: 'completed',
        timeSpent: Math.floor((Date.now() - startTime) / 1000), // Time spent in seconds
      };
      await logEngagement(engagementData);

      const { report, timeTaken } = await submitPracticeAnswers(sessionId, formattedAnswers);

      setReport(report); // Store the report data to show the report
      setTimeTaken(timeTaken);

      if (!report || report.length === 0) {
        throw new Error('Report data is missing');
      }

      let correctAnswers = 0;
      const totalQuestions = report.length;

      report.forEach((question) => {
        if (question.isCorrect) {
          correctAnswers += 1;
        }
      });

      const scorePercentage = (correctAnswers / totalQuestions) * 100;

      const scoreRanges = [
        { range: '0-10', count: 0 },
        { range: '11-20', count: 0 },
        { range: '21-30', count: 0 },
        { range: '31-40', count: 0 },
        { range: '41-50', count: 0 },
        { range: '51-60', count: 0 },
        { range: '61-70', count: 0 },
        { range: '71-80', count: 0 },
        { range: '81-90', count: 0 },
        { range: '91-100', count: 0 },
      ];

      if (scorePercentage <= 10) {
        scoreRanges[0].count = 1;
      } else if (scorePercentage <= 20) {
        scoreRanges[1].count = 1;
      } else if (scorePercentage <= 30) {
        scoreRanges[2].count = 1;
      } else if (scorePercentage <= 40) {
        scoreRanges[3].count = 1;
      } else if (scorePercentage <= 50) {
        scoreRanges[4].count = 1;
      } else if (scorePercentage <= 60) {
        scoreRanges[5].count = 1;
      } else if (scorePercentage <= 70) {
        scoreRanges[6].count = 1;
      } else if (scorePercentage <= 80) {
        scoreRanges[7].count = 1;
      } else if (scorePercentage <= 90) {
        scoreRanges[8].count = 1;
      } else {
        scoreRanges[9].count = 1;
      }

      const scoreData = {
        sessionId,
        scoreRanges,
      };

      await saveScoreDistribution(scoreData);

      // Navigate to performance analysis page after setting performanceData
      router.push({
        pathname: '/Student/Performanceanalysis',
        query: { report: JSON.stringify(report), timeTaken: timeTaken },
      });

    } catch (error) {
      console.error('Error submitting answers:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allAnswered = Array.isArray(questions) && questions.every(
    (question) => answers[question._id] !== undefined
  );

  if (report) {
    return <Performance questions={report.questions} timeTaken={timeTaken} />;
  }

  // Ensure questions are loaded and handle out-of-bound index
  if (!questions || questions.length === 0) {
    return <div>No questions available for this session.</div>;
  }

  const currentQ = questions[currentQuestion];

  if (!currentQ) {
    return <div>Question not available</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">
          {currentQuestion + 1} / {questions.length}
        </div>
        <h1 className="text-2xl font-bold text-center flex-grow">Practice Session</h1>
        <div className="text-lg font-semibold">
          Time left: {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Question text */}
      <div className="mb-9">
        <h2 className="text-lg font-medium">{currentQ.questionText}</h2>
      </div>

      {/* MCQ section */}
      {currentQ.type.toUpperCase() === "MCQ" && currentQ.option && (
  <RadioGroup
    value={answers[currentQ._id] || ''}
    onChange={(answer) => handleAnswerChange(currentQ._id, answer)}
    className="space-y-4"
  >
    {currentQ.option.map((option, index) => (
      <div key={index} className="mb-8">
        <Radio
          key={index}
          value={option}
          

          className={({ checked }) =>
            `relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none transition-all
            ${checked ? 'bg-lime-400 border border-white' : 'bg-slate-50'}
            hover:bg-green-300`
          }
        >
          {/* <span className="text-sm flex w-full items-center justify-between font-medium text-black ">{option}</span> */}

          <span className="text-sm flex w-full items-center justify-between font-medium text-black">
                  {option}
                  {answers[currentQ._id] === option && (
                    <CheckCircleIcon className="w-6 h-6 text-green-500 ml-2" />
                  )}
                </span>
        </Radio>
      </div>
    ))}
  </RadioGroup>
)}

      {/* Descriptive section */}
      {currentQ.type.toUpperCase() === 'DESCRIPTIVE' && (
        <textarea
          className="w-full p-4 border rounded-lg mt-4"
          value={answers[currentQ._id] || ''}
          onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
          rows={6}
        />
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        {currentQuestion > 0 && (
          <button
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg"
          >
            Previous
          </button>
        )}
        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion((prev) => prev + 1)}
            className="px-6 py-2 bg-green-500 text-white rounded-lg"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !allAnswered}
            className={`px-6 py-2 ${isSubmitting || !allAnswered ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded-lg`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticeSession;
