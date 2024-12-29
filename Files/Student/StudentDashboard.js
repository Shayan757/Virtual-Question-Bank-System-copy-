
'use client'

import { useState, useContext } from 'react';
import PracticeSession from './PracticeSession'; // Ensure to import the PracticeSession component
import AdminContext from '../../Context/AdminContext'; // Adjust based on your context path
import  Spinner  from './loader';
import {Card} from "@/Files/Admin/ui/card"
import {Button} from "@/Files/Admin/ui/button"
import Footer from './Footer';

const Dashboard = () => {
  const [Filters, setFilters] = useState({ type: '', subject: '', topic: '', difficulty: '' });
  

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [sessionId, setSessionId] = useState(null); // Add this to your component's state
  const { fetchQuestionsAndStartSession } = useContext(AdminContext); // Adjust based on your context



  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };



  const areAllFieldsSelected = Object.values(Filters).every(field => field !== '');


  const handleStartPractice = async () => {

    if (!areAllFieldsSelected) {
      alert("Please select all fields");
      return;
    }


        setLoading(true);
        setError("");

        // Set a minimum 3-second loading time
    const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 3000));


        try {
          

           // Start fetching session data and wait for both the data and the minimum loading time
      const [sessionData] = await Promise.all([
        fetchQuestionsAndStartSession(Filters),
        minimumLoadingTime,
      ]);
      
      setSession(sessionData);

      

        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };


  

  return (
    
    <div className=" p-8 border-b border-gray-300 min-h-screen">
    <div className="max-w-4xl mx-auto mt-8 relative">
    

     {/* Centered Spinner */}
     {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <Spinner/>
          </div>
        )}
        
      {!session && (
        
        <>
        
          <Card className="p-6 space-y-4">
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label>Type</label>
                <select
                  value={Filters.type}
                  onChange={handleOnChange}
                  name="type"
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Type</option>
                  <option value="MCQ">MCQ</option>
                  <option value="DESCRIPTIVE">Descriptive</option>
                </select>
              </div>
              <div>
                <label>Subject</label>
                <select
                  value={Filters.subject}
                  onChange={handleOnChange}
                  name="subject"
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Subject</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>

              <div>
                <label>Topic</label>
                <select
                  value={Filters.topic}
                  onChange={handleOnChange}
                  name="topic"
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Topic</option>
                  <option value="Kinematics">Kinematics</option>
                  <option value="Sodium-Compounds">Compounds of Sodium</option>
                  <option value="Measurements">Measurements</option>
                  <option value="Molecular-mass">Molecular mass</option>
                </select>
              </div>

              <div>
                <label>Difficulty</label>
                <select
                  value={Filters.difficulty}
                  onChange={handleOnChange}
                  name="difficulty"
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Start Button */}
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleStartPractice}
                className="px-4 py-2 bg-green-500 text-white rounded w-32 hover:bg-indigo-500"
                disabled={loading}
              >
            

                Start Practice

              </Button>

              
            </div>

            
          </Card>


        </>
      )}


      {/* Show the PracticeSession component if the session is started */}
      {session && (
        <PracticeSession
          sessionId={session._id}
          questions={session.questions}
          timeLimit={session.timeLimit}
          title="Practice Session"
        />
      )}
    </div>

  </div>
  
);

};

export default Dashboard;
