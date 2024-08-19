


import { useState } from 'react';
import AdminContext from './AdminContext';

const AdminState = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);

// Question state //

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

  const updateQuestion = async (id,UpdateQuestiondata) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/UpdateQuestion/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify(UpdateQuestiondata)
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
          'auth-token': localStorage.getItem('token'), // Ensure the token is present

        },
  
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

  // User state //

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/getuser`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem("token")
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching users');
      }

      const json = await response.json();
      setUsers(json);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateUsers = async (id,UpdateUserdata) => {
    try {

      console.log('Sending data:', UpdateUserdata);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/updateUser/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // "auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify(UpdateUserdata)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error updating user: ${errorData.message}`);
      }

      const updated = await response.json();
      setUsers(prevUsers => prevUsers.map(user => user._id === id ? updated : user));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };


  const deleteUsers = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/deleteUser/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          // 'auth-token': localStorage.getItem('token'), // Ensure the token is present

        },
  
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error deleting users: ${errorData.message}`);
      }

      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  const fetchUserActivity = async (userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/userActivity/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error fetching user activity: ${errorData.message}`);
      }

      const activityLog = await response.json();
      setUsers(activityLog);
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };


  return (
    <AdminContext.Provider value={{ questions,users,fetchUsers, fetchUserActivity,updateUsers,deleteUsers,addQuestion, updateQuestion, deleteQuestion, fetchQuestions }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminState;
