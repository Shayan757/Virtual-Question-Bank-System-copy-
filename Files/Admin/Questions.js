import { useState, useContext, useEffect } from 'react';
import { Button } from "@/Files/Admin/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Files/Admin/ui/alert-dialog"

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
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions().then(() => console.log("Fetched questions:", questions));
  }, []);

  // const ref = useRef(null)
  // const refClose = useRef(null)



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
    setSelectedQuestion(question);
    setIsModalOpen(true);
    // ref.current.click();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };


  const handleSaveChanges = async () => {

    // refClose.current.click();

    if (selectedQuestion) {
      try {
        await updateQuestion(selectedQuestion._id, selectedQuestion);
        // fetchQuestions(); // Refresh the list after updating
        setIsModalOpen(false); // Close the modal
      } catch (error) {
        console.error('Error updating question:', error);
      }
    }
  };

  console.log('Questions:', questions);

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
              <span className="block font-semibold text-lg">Subject: {question.subject}</span>
              <span className="block text-sm text-gray-600">Topic: {question.topic}</span>
              <span className="block text-sm text-gray-600">Question: {question.questionText}</span>
              <span className="block text-sm text-gray-600">Difficulty: {question.difficulty}</span>
              <span className="block text-sm text-gray-600">Type: {question.type}</span>
            </div>
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
            {question.type === 'descriptive' && (
              <div className="mb-2">
                <span className="block font-semibold">Descriptive Answer:</span>
                <p className="text-gray-700">{question.descriptiveAnswer}</p>
              </div>
            )}
            <div className="mt-2 flex justify-end">

            
            <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='bg-yellow-500 text-white hover:bg-yellow-600 py-2 rounded-md' onClick={() => handleEditClick(question)}>Edit</Button>

                  </AlertDialogTrigger>

              {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => deleteQuestion(question._id)}>Delete</button> */}
               {/* <Button variant='destructive'>Delete</Button>               */}


               <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Edit Question</AlertDialogTitle>
                    <AlertDialogDescription>
                      Make changes to your question below.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                       
             {/* Your form fields or inputs for editing the question would go here */}



      
             <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCloseModal}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSaveChanges}>Save Changes</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            

              {/* Delete Button */}
              <Button className='bg-red-500 text-white hover:bg-red-600 py-2 rounded-md' onClick={() => deleteQuestion(question._id)}>Delete</Button>
            
            </div>
          
          </li>
          
        ))}
      
      </ul>

      {/* Modal */}
      <div>
{/* 
        <button
          type="button"
          className="btn btn-primary"


          onClick={() => setIsModalOpen(true)}

        >
          Launch demo modal
        </button> */}
{/* <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button> */}

        {/* Modal */}
        

        {/* {isModalOpen && (
  <AlertDialog>
    <AlertDialogTrigger >Open</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleCloseModal}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleSaveChanges}>Update</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
 )} 
   */}



  
      </div>
    </div>
  );
};
  

export default Questions;


