


'use client'

import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import AdminContext from '../../Context/AdminContext';
import { Button } from '@/Files/Admin/ui/button'
import Spinner from './loader';


const PerformanceAnalysis = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const { StoreMetrics, updateQuestionAnalysis } = useContext(AdminContext); // New context methods
  const [score, setScore] = useState(0);  // State to hold the score
  const [timeTaken, setTimeTaken] = useState(0); // State to hold time taken
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [averageTimePerQuestion, setAverageTimePerQuestion] = useState(0);
  const hasCalledApis = useRef(false);  // Ref to track API calls

  const [loading, setLoading] = useState(true);


  const handleBack = async (e) => {
    e.preventDefault();

    router.push("/Student/studentdashboard")

  }


  useEffect(() => {
    if (router.query.report && !hasCalledApis.current) {
      try {
        const parsedReport = JSON.parse(router.query.report);
        console.log('Parsed Report:', parsedReport);

        if (Array.isArray(parsedReport) && parsedReport.length > 0) {
          setQuestions(parsedReport); // Set the questions from the parsed report

          // Calculate correct and incorrect answers
          const correct = parsedReport.filter(q => q.isCorrect).length;
          const incorrect = parsedReport.length - correct;
          setCorrectAnswers(correct);
          setIncorrectAnswers(incorrect);
          setScore(correct); // Set the score based on correct answers

          // Parse and set timeTaken
          let time = 0;
          if (router.query.timeTaken) {
            time = Number(router.query.timeTaken);
            console.log('Parsed timeTaken:', time);
            setTimeTaken(isNaN(time) ? 0 : time);
          }

          // Calculate average time per question
          const avgTime = time / parsedReport.length;
          setAverageTimePerQuestion(avgTime.toFixed(2));

          // Store performance metrics once timeTaken is set
          const metricsData = {
            sessionId: router.query.sessionId, // Assuming sessionId is passed via query
            correctAnswers: correct,
            incorrectAnswers: incorrect,
            averageTimePerQuestion: avgTime.toFixed(2), // Calculate average time per question
            totalScore: correct, // Modify this if needed
          };
          StoreMetrics(metricsData); // Call API to store metrics

          // Update question analysis (correct/incorrect responses)
          parsedReport.forEach((question) => {
            if (question.questionId) { // Ensure questionId exists
              updateQuestionAnalysis({
                questionId: question.questionId,
                correctResponses: question.isCorrect ? 1 : 0,
                incorrectResponses: question.isCorrect ? 0 : 1,
              });
            } else {
              console.error('Missing question ID for question:', question);
            }
          });

          // Mark the API calls as done
          hasCalledApis.current = true;

        } else {
          console.error('No valid questions found in the report.');
        }
      } catch (error) {
        console.error('Failed to parse report:', error);
      }
    }
  }, [router.query]);  // Minimal dependencies to avoid multiple triggers


  useEffect(() => {
    // Simulate a network request or loading phase
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);



  // Function to format time taken
  const formatTime = (seconds) => {
    if (seconds <= 0) {
      return "No time recorded"; // Handle zero or negative time taken
    }

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`; // Return seconds if less than 60
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  };

  if (!Array.isArray(questions) || questions.length === 0) {
    return <div className="text-red-500 mt-7">No questions available for this session report.</div>;
  }



   return (
     <div className="max-w-3xl mx-auto mt-8 p-4 bg-slate-100 shadow-xl rounded-lg">


    {loading ? ( 
      <Spinner/>
   ) : (
    <>
         <h2 className="text-2xl font-bold text-gray-500 mb-8 text-center">Practice Session Report</h2>
         <div className="mb-3 mt-5 text-center">
             <p className="text-lg text-green-600 font-semibold">
                 Score: {score} / {questions.length}
             </p>
             <p className="text-lg text-green-600 font-semibold">
               Percentage: {((score / questions.length) * 100).toFixed(2)}%
             </p>
             {timeTaken !== undefined && ( 
                 <p className="text-lg text-red-500 font-semibold">
                    Time Taken: {formatTime(timeTaken)}
                </p>
            )}
        </div> 
         {questions.map((question, index) => { 
             const isCorrect = question.isCorrect;
            const selectedAnswer = question.selectedAnswer || '';
             const correctAnswer = question.correctAnswer || '';
             const explanation = question.explanation || '';
             const descriptiveAnswer = question.descriptiveAnswer || '';

            return (
                 <div key={index} className="mb-6 border-b pb-4">
                     <h3 className="text-lg font-bold">{index + 1}. {question.questionText}</h3>
                     <ul className="mt-2">
                         {question.options?.map((opt, idx) => ( 
                             <li 
                                 key={idx}
                                 className={`p-2 ${opt === selectedAnswer ? (isCorrect ? 'bg-green-200' : 'bg-red-200') : ''}`}
                             />
                         ))}
                     </ul> 
                     <div className="mt-2 px-6">
                         {isCorrect ? ( 
                             <p className="text font-semibold">
                                 You selected: <span className="text-green-600 ">{selectedAnswer || descriptiveAnswer}</span> <span className="text-green-600">Correct!</span>
                             </p>
                         ) : (
                             <p className="text font-semibold">
                               You selected: <span className="text-red-600">{selectedAnswer || descriptiveAnswer}</span> <span className="text-red-600">Incorrect!</span>
                             </p>
                         )}
                     </div> 
                     {isCorrect && explanation && (
                         <div className="mt-2 px-6">
                             <p className="text-sm font-semibold mb-2">Explanation:</p>
                             <p className="text-sm text-gray-700 font-semibold">{explanation}</p>
                         </div>
                     )}
                 </div> 
           );
         })}
         <Button className="bg-gray-400 justify-end hover:bg-orange-200" onClick={handleBack}>Back</Button>
     </> 
   )}
   </div>
 ) 
};

export default PerformanceAnalysis;
