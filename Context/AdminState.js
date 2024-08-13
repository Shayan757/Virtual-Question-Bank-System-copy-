// import { useState } from 'react';
// import AdminContext from './AdminContext';

// const AdminState = ({ children }) => {
//   const [questions, setQuestions] = useState([]);

//   const fetchQuestions = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/getQuestion`,{
//         method: "GET",
//         headers: {
//           'Content-Type': 'application/json',
//           "auth-token"  : localStorage.getItem("token")
//         },

//       })


//       const json = await response.json()

//       setQuestions(json)
      
    
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     }
//   };

  

//   const addQuestion = async (subject,topic,questionText,difficulty,option) => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/CreateQuestion`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           "auth-token"  : localStorage.getItem("token")
//         },
//         body: JSON.stringify(subject,topic,questionText,difficulty,option)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Error adding question: ${errorData.message}`);
//       }

//       const newQuestion = await response.json();
//       console.log('New question added:', newQuestion);
//       setQuestions(questions.concat(newQuestion))
//     } catch (error) {
//       console.error('Error adding question:', error);
//     }
//   };

//   const updateQuestion = async (id,subject,topic,questionText,difficulty,option) => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/UpdateQuestion/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(subject,topic,questionText,difficulty,option)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Error updating question: ${errorData.message}`);
//       }

//       const updatejson = await response.json();
//       console.log(updatejson);

//       const UpdateQuestion = questions.filter((questions) => questions.id !== id);

//       setQuestions(UpdateQuestion);

//     } catch (error) {
//       console.error('Error updating question:', error);
//     }
//   };

//   const deleteQuestion = async (id) => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/DeleteQuestion/${id}`, {
//         method: 'DELETE',

//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({id}),

//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Error deleting question: ${errorData.message}`);
//       }

//       const updatejson = await response.json();
//       console.log(updatejson);

//       const DeketeQuestion = questions.filter((questions) => questions.id !== id);

//       setQuestions(DeketeQuestion);

//     } catch (error) {
//       console.error('Error deleting question:', error);
//     }
//   };

//   return (
//     <AdminContext.Provider value={{ questions, addQuestion, updateQuestion, deleteQuestion, fetchQuestions }}>
//       {children}
//     </AdminContext.Provider>
//   );
// };

// export default AdminState;



import { useState } from 'react';
import AdminContext from './AdminContext';

const AdminState = ({ children }) => {
  const [questions, setQuestions] = useState([]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/getQuestion`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem("token")
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching questions');
      }

      const json = await response.json();
      setQuestions(json);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const addQuestion = async (questionData) => {
    
    try {

      console.log('Before API call:', questions);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/CreateQuestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify(questionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error adding question: ${errorData.message}`);
      }

    //   const addedQuestion = await response.json();
    //   setQuestions(questions.concat(addedQuestion));
    // } catch (error) {
    //   console.error('Error adding question:', error);
    // }

    // const newQuestion = await response.json();
    //   setQuestions(prevQuestions => [...prevQuestions, newQuestion]);

    const newQuestion = await response.json();
    console.log('API Response:', newQuestion);

    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions, newQuestion];
      console.log('After API call:', updatedQuestions);
      return updatedQuestions;
    });
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const updateQuestion = async (id,subject,topic,questionText,difficulty,option) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/UpdateQuestion/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(id,subject,topic,questionText,difficulty,option)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error updating question: ${errorData.message}`);
      }

      const updated = await response.json();
      setQuestions(questions.map(question => question._id === id ? updated : question));
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/DeleteQuestion/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error deleting question: ${errorData.message}`);
      }

      setQuestions(questions.filter(question => question._id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <AdminContext.Provider value={{ questions, addQuestion, updateQuestion, deleteQuestion, fetchQuestions }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminState;
