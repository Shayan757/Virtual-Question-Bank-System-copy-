
'use client'

import { useState } from 'react';
import AdminContext from './AdminContext';

const AdminState = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [practiceSessions, setPracticeSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null); // Add this to your component's state

  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [studentId, setStudentId] = useState(''); // Initialize studentId
  


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

  



  const fetchQuestionsAndStartSession = async (filters) => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/getQuestions?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
  
      const questionsData = await response.json();
      setQuestions(questionsData);
  
      // Start practice session with the fetched questions
      const questionIds = questionsData.map(q => q._id); // Extract question IDs
      const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/startPractice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          questionIds,
          timeLimit: 30, // Example: 30 minutes
        }),
      });
  
      if (!sessionResponse.ok) {
        throw new Error('Failed to start practice session');
      }
  
      const sessionData = await sessionResponse.json();
      setSessionId(sessionData._id); // Set session ID here
    console.log('Session ID set:', sessionData._id); // Debug log to verify session ID
      return {
        questions: questionsData,
        timeLimit: sessionData.timeLimit,
        _id: sessionData._id, 
      };
    } catch (error) {
      setError(error.message);
      throw error; // Rethrow error to handle in the component
    } finally {
      setLoading(false);
    }
  };

    // Send notification
const sendNotification = async (studentId,title, message) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/sendNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       'auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({studentId, title, message }), // Include studentId in the body
    });

    if (!response.ok) throw new Error('Error sending notification');

    

  } catch (error) {
    console.error('Failed to send notification:', error);
    setError('Failed to send notification');
  }
};



   // Notifications-related operations
// Notifications-related operations
const fetchNotifications = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/getNotifications`, { // Updated to use route parameter
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'), // Uncomment if using auth token
      }
    });

    if (!response.ok) throw new Error('Error fetching notifications');

    const data = await response.json();
    setNotifications(data.notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    setError('Failed to fetch notifications');
  } finally {
    setLoading(false);
  }
};



  const markNotificationAsRead = async (notificationId) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/markNotificationRead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ notificationId })
      });

      if (!response.ok) throw new Error('Error marking notification as read');

      // Refresh notifications after marking as read
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('Failed to mark notification as read');
    } finally {
      setLoading(false);
     }
  };

  // Messages-related operations
const fetchMessages = async () => {
  

  setLoading(true);  // Start loading state
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/getMessages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token"  : localStorage.getItem("token")
      },
    });

    // Check if the response is not ok
    if (!response.ok) throw new Error('Error fetching messages');

    const data = await response.json();

    // Ensure data.messages exists before setting state
    if (data && data.messages) {
      setMessages(data.messages);
    } else {
      setMessages([]);  // Set to empty if no messages are returned
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    setError('Failed to fetch messages');
  } finally {
    setLoading(false);  // Stop loading state
  }
};






  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "auth-token"  : localStorage.getItem("token")

        },
        body: JSON.stringify({ message }),  // Send studentId and message as separate fields
      });

      console.log({ message });  // Log the data before sending

  
      if (!response.ok) throw new Error('Error sending message');
  
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };
  

  


  const submitPracticeAnswers = async (sessionId,answers) => {
    
  


    if (!answers || answers.length === 0) {
      console.error("No answers provided for submission!");
      return; // Ensure there are answers to submit
    }
  
  

     try { 

  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/submitAnswers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ sessionId, answers }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error submitting answers: ${errorData.message}`);
      }
  
      const result = await response.json();

       // Store the score, accuracy, and time taken for user feedback
    // console.log('Score:', result.score);
    // console.log('Accuracy:', result.accuracy);
    // console.log('Time Taken:', result.timeTaken);

    
      
      // Update session status to 'completed'
      setPracticeSessions(prevSessions =>
        prevSessions.map(session =>
          session._id === sessionId ? { ...session, status: 'completed' } : session
        )
      );

      console.log("Session ID in submitPracticeAnswers:", sessionId);

      return { report: result.report, timeTaken: result.timeTaken };
      

  
    } catch (error) {
      console.error('Error submitting practice answers:', error);
    }
  };
  
  
  const fetchAdminMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/getadminMessages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
  
      if (!response.ok) throw new Error('Error fetching admin messages');
  
      const data = await response.json();
      setMessages(data.messages || []);  // Set messages or empty array if none
    } catch (error) {
      console.error('Error fetching admin messages:', error);
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };
  


  // Send admin response to a message
  const sendAdminResponse = async (messageId, adminResponse) => {
    if (!messageId || !adminResponse) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/respondToMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        
        },
        body: JSON.stringify({ messageId, adminResponse }),
      });

      if (!response.ok) throw new Error('Error sending response');

      // Fetch updated messages after sending response
      fetchMessages();
    } catch (error) {
      console.error('Failed to send response:', error);
      setError('Failed to send response');
    }
  };


  // incrementUsage
const incrementUsage = async (questionId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/increment-usage/${questionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    console.log(data.message);
  } catch (error) {
    console.error('Error incrementing question usage:', error);
  }
}


const fetchUsageCount = async (questionId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/get-usage/${questionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    console.log(`Usage count for question ${questionId}:`, data.usageCount);
    return data; // Ensure this function returns data
  } catch (error) {
    console.error('Error fetching question usage count:', error);
  }
};



// StoreMetrics
const StoreMetrics = async (metricsData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/store-metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify(metricsData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    console.log(data.message);
  } catch (error) {
    console.error('Error storing performance metrics:', error);
  }
}



// getMetrics
const getMetrics = async (sessionId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/get-metrics/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    });

    const metrics = await response.json();
    if (!response.ok) {
      throw new Error(metrics.error);
    }
    return metrics;  // Return metrics data
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return null; // Return null in case of error
  }
};

const fetchQuestionIds = async (limit = 5) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/get-latest-questions?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data.questionIds;
  } catch (error) {
    console.error('Error fetching recent question IDs:', error);
    return [];
  }
};




// logEngagement
const logEngagement = async (engagementData) => {
  console.log("Engagement data:", engagementData);  // Log the data being sent

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/log-engagement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),  // Ensure token is included

      },
      body: JSON.stringify({
        action: engagementData.action,      // Pass only the action
        timeSpent: engagementData.timeSpent // Pass only the timeSpent
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    console.log(data.message);
  } catch (error) {
    console.error('Error logging engagement:', error);
  }
}




const getEngagementLogs = async (sessionId = null, studentId = null) => {
  try {
    // Construct query parameters based on sessionId and studentId if they exist
    const queryParams = new URLSearchParams();
    if (sessionId) queryParams.append('sessionId', sessionId);
    if (studentId) queryParams.append('studentId', studentId);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/get-engagements?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    });

    const engagementLogs = await response.json();

    if (!response.ok) {
      throw new Error(engagementLogs.error);
    }

    return engagementLogs;

  } catch (error) {
    console.error('Error fetching engagement logs:', error);
  }
};



// Save score
const saveScoreDistribution = async (scoreData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/score-distribution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify(scoreData),

    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    console.log(data.message);
  } catch (error) {
    console.error('Error saving score distribution:', error);
  }
}


 // Fetch score distribution for a specific session
const fetchScoreDistribution = async (sessionId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/score-distribution/${sessionId}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },

    }); 
    
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error fetching score distribution:', error);
    return null;
  }
};



// Fetch the latest completed sessionId
 const fetchLatestSessionId = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/latest-session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',

      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }

    return data.sessionId;
  } catch (error) {
    console.error('Error fetching the latest session ID:', error);
    return null;
  }
};




// Question Analysis
const updateQuestionAnalysis = async (analysisData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/question-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      
      },
      body: JSON.stringify(analysisData),

    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    console.log(data.message);
  } catch (error) {
    console.error('Error saving score distribution:', error);
  }
}




// Fetch Question Analysis
const fetchQuestionAnalysis = async (questionId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/question-analysis/${questionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data; // Return analysis data
  } catch (error) {
    console.error('Error fetching question analysis:', error);
    return null;
  }
};




const createProfile = async (profileData) => {
  try {
    // Create a FormData object
    const formData = new FormData();
    
    // Append text fields
    formData.append("username", profileData.username || "");
    formData.append("phoneNumber", profileData.phoneNumber || "");
    formData.append("dateOfBirth", profileData.dateOfBirth || "");
    formData.append("institution", profileData.institution || "");
    formData.append("gradeYear", profileData.gradeYear || "");
    
    // Append subjects array, if provided
    if (profileData.subjectsOfInterest) {
      profileData.subjectsOfInterest.forEach((subject, index) =>
        formData.append(`subjectsOfInterest[${index}]`, subject)
      );
    }
    
    // Append the file if it exists
    if (profileData.profilePicture) {
      formData.append("profilePicture", profileData.profilePicture);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/profileSetting`, {
      method: 'POST',
      headers: {
      
        'auth-token': localStorage.getItem('token')
      },
      body: formData, // Use FormData as the body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error creating profile: ${errorData.message}`);
    }

    const newProfile = await response.json();
    setUsers(prevUsers => [...prevUsers, newProfile.profile]); // Add new profile to the state
  } catch (error) {
    console.error('Error creating profile:', error);
  }
};




const getProfile = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/getprofile`, {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token')
      }
    });

    if (!response.ok) {
      const errorData = response.headers.get('content-type')?.includes('application/json')
        ? await response.json()
        : { error: 'Internal Server Error' };
      throw new Error(`Error fetching profile: ${errorData.error}`);
    }

    const profileData = await response.json();
    
    // Assuming setUsers or setProfile is used to manage the user profile state
    setUsers((prevUsers) => 
      prevUsers.map((user) => 
        user._id === profileData.profile._id ? { ...user, ...profileData.profile } : user
      )
    );

    return profileData.profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};



const deleteProfile = async (id) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/profileSettingdelete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'), // Authorization header
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error deleting profile: ${errorData.message}`);
    }

    setUsers(prevUsers => prevUsers.filter(user => user._id !== id)); // Update state
  } catch (error) {
    console.error('Error deleting profile:', error);
  }
};



  return (
    <AdminContext.Provider value={{questions,users,notifications,messages,createProfile,getProfile,deleteProfile,fetchUsers, fetchQuestionIds,fetchAdminMessages, fetchQuestionAnalysis, getEngagementLogs, fetchUsageCount,updateUsers,deleteUsers,addQuestion, updateQuestion, deleteQuestion, fetchQuestions, fetchQuestionsAndStartSession, submitPracticeAnswers,sendNotification, fetchNotifications,markNotificationAsRead,fetchMessages, sendMessage, sendAdminResponse,incrementUsage,StoreMetrics,logEngagement,saveScoreDistribution,updateQuestionAnalysis , fetchScoreDistribution, fetchLatestSessionId,getMetrics}}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminState;
