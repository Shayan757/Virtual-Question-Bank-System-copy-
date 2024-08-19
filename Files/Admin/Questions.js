import { useState, useContext, useEffect } from 'react';
import { Button } from "@/Files/Admin/ui/button";

import AdminContext from '../../Context/AdminContext';

const Questions = () => {
  const { questions, fetchQuestions, addQuestion, updateQuestion, deleteQuestion } = useContext(AdminContext);
  const [newQuestion, setNewQuestion] = useState({
    type: '',
    subject: '',
    topic: '',
    difficulty: '',
    questionText: '',
    option: [],
    correctAnswer: '',
    descriptiveAnswer: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState({id:"", type:"", subject:"", topic:"", difficulty:"", questionText:"", option:"", correctAnswer:"", descriptiveAnswer:"" });

  useEffect(() => {
    fetchQuestions().then(() => console.log("Fetched questions:", questions));
  }, []);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prevState => ({
      ...prevState,
      [name]: name === 'option' ? value.split(',') : value
    }));
  };



  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      // Trim spaces from options and correct answer
      const trimmedOptions = newQuestion.option.map(opt => opt.trim());
      const trimmedCorrectAnswer = newQuestion.correctAnswer.trim();

      if (!trimmedOptions.includes(trimmedCorrectAnswer)) {
        alert('Correct answer must be one of the provided options');
        return;
      }

      await addQuestion({
        type: newQuestion.type,
        subject: newQuestion.subject,
        topic: newQuestion.topic,
        difficulty: newQuestion.difficulty,
        questionText: newQuestion.questionText,
        option: newQuestion.type === 'mcq' ? trimmedOptions : undefined,
        correctAnswer: trimmedCorrectAnswer,
        descriptiveAnswer: newQuestion.type === 'descriptive' ? newQuestion.descriptiveAnswer : undefined,
      });

      // Reset the form
      setNewQuestion({
        type: '',
        subject: '',
        topic: '',
        difficulty: '',
        questionText: '',
        option: [],
        correctAnswer: '',
        descriptiveAnswer: ''
      });

      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleEditClick = (question) => {
    console.log('Editing Question:', question); // Log the selected question
    setSelectedQuestion({
      ...question,
      option: Array.isArray(question.option) ? question.option.join(',') : '' // ensure option is a string for editing

    });
    setIsModalOpen(true);
    // ref.current.click();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };


  const handleSaveChanges = async () => {

   
    if (selectedQuestion) {
      const updatedQuestion = {
        ...selectedQuestion,
        option: selectedQuestion.type === 'mcq' ? selectedQuestion.option : undefined,
        descriptiveAnswer: selectedQuestion.type === 'descriptive' ? selectedQuestion.descriptiveAnswer : undefined,
      };
  
      try {
        await updateQuestion(selectedQuestion._id, updatedQuestion);
        setIsModalOpen(false);
        fetchQuestions(); // Refresh the list after updating
      } catch (error) {
        console.error('Error updating question:', error);
      }
    }
  };

  console.log('Questions:', questions);


  const ehandleChange = (e) => {
    const { name, value } = e.target;
    setSelectedQuestion(prevState => ({
      ...prevState,
      [name]: name === 'option' ? value.split(',') : value // Updated to use the original property names
    }));
  };


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Question Management</h2>
      <form onSubmit={handleCreateQuestion} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700">Type</label>
          <select name="type" value={newQuestion.type} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
            <option value="">Select type</option>
            <option value="mcq">MCQ</option>
            <option value="descriptive">Descriptive</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Subject</label>
          <input type="text" name="subject" value={newQuestion.subject} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Topic</label>
          <input type="text" name="topic" value={newQuestion.topic} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Difficulty</label>
          <select name="difficulty" value={newQuestion.difficulty} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Question Text</label>
          <textarea name="questionText" value={newQuestion.questionText} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        {newQuestion.type === 'mcq' && (
          <div className="mb-4">
            <label className="block text-gray-700">Options</label>
            <input type="text" name="option" value={newQuestion.option.join(',')} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
        )}
        {newQuestion.type === 'descriptive' && (
          <div className="mb-4">
            <label className="block text-gray-700">Descriptive Answer</label>
            <textarea name="descriptiveAnswer" value={newQuestion.descriptiveAnswer} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Correct Answer</label>
          <input type="text" name="correctAnswer" value={newQuestion.correctAnswer} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Question</button>
      </form>
      <ul className="list-none p-0">
        {questions.map((question) => (


          <li key={question._id} className="flex flex-col justify-between items-start mb-4 border p-4 rounded-lg shadow-md">
            <div className="mb-2">
  <span className="block font-semibold text-lg">Type: {question.type}</span>
  <span className="block font-semibold text-lg">Subject: {question.subject}</span>
  <span className="block text-sm text-gray-600">Topic: {question.topic}</span>
  <span className="block text-sm text-gray-600">Difficulty: {question.difficulty}</span>
  <span className="block text-sm text-gray-600">Question: {question.questionText}</span>
  
  {/* Display Options only if it's an MCQ */}
  {question.type === 'mcq' && (
    <div className="mb-2">
      <span className="block font-semibold">Options:</span>
      <ul className="list-disc list-inside pl-4">
        {question.option.map((opt, index) => (
          <li key={index} className="text-gray-700">{opt}</li>
        ))}
      </ul>
    </div>
  )}
  
  {/* Add Correct Answer Display */}
  <span className="block text-sm text-gray-600">Correct Answer: {question.correctAnswer}</span>
  
  {/* Display Descriptive Answer if it's a descriptive question */}
  {question.type === 'descriptive' && (
    <div className="mb-2">
      <span className="block font-semibold">Descriptive Answer:</span>
      <p className="text-gray-700">{question.descriptiveAnswer}</p>
    </div>
  )}
</div>
            <div className="mt-5 flex space-x-4">

            
            
                  <Button className='bg-yellow-500 text-white hover:bg-yellow-600 py-2 rounded-md' onClick={() => handleEditClick(question)}>Edit</Button>




      
             

              {/* Delete Button */}
              <Button className='bg-red-500 text-white hover:bg-red-600 py-2 rounded-md' onClick={() => deleteQuestion(question._id)}>Delete</Button>
            
            </div>
          
          </li>
          
        ))}
      
      </ul>

      
      <div>
 
    

        {/* Modal */}
        

        {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative w-full max-w-3xl p-4 mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center border-b pb-2">
        <h1 className="text-xl font-semibold" id="exampleModalLabel">Edit Question</h1>
        <button type="button" className="text-gray-500 hover:text-gray-700" onClick={handleCloseModal}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div className="py-4">
        {/* Place your modal content here */}

        <form>
        <div className="mb-4">
          <label className="block text-gray-700">Type</label>
          <select name="type" value={selectedQuestion.type} onChange={ehandleChange} className="w-full px-3 py-2 border rounded-lg">
            <option value="">Select type</option>
            <option value="mcq">MCQ</option>
            <option value="descriptive">Descriptive</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Subject</label>
          <input type="text" name="subject" value={selectedQuestion.subject} onChange={ehandleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Topic</label>
          <input type="text" name="topic" value={selectedQuestion.topic} onChange={ehandleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Difficulty</label>
          <select name="difficulty" value={selectedQuestion.difficulty} onChange={ehandleChange} className="w-full px-3 py-2 border rounded-lg">
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Question Text</label>
          <textarea name="questionText" value={selectedQuestion.questionText} onChange={ehandleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        {selectedQuestion.type === 'mcq' && (
          <div className="mb-4">
            <label className="block text-gray-700">Options</label>
            <input type="text" name="option" value={Array.isArray(selectedQuestion.option) ? selectedQuestion.option.join(',') : selectedQuestion.option || ''} onChange={ehandleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
        )}
        {selectedQuestion.type === 'descriptive' && (
          <div className="mb-4">
            <label className="block text-gray-700">Descriptive Answer</label>
            <textarea name="descriptiveAnswer" value={selectedQuestion.descriptiveAnswer} onChange={ehandleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Correct Answer</label>
          <input type="text" name="correctAnswer" value={selectedQuestion.correctAnswer} onChange={ehandleChange} className="w-full px-3 py-2 border rounded-lg" />
        </div>
 </form>
        
      </div>
      <div className="flex justify-end border-t pt-2">
        <button type="button" className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleCloseModal}>Close</button>
        <button type="button" className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleSaveChanges}>Update</button>
      </div>
    </div>
  </div>
)}




  
      </div>
    </div>
  );
};
  

export default Questions;


