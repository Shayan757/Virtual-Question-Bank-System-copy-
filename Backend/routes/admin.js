const express = require('express'); 
const router = express.Router();
const { body, validationResult } = require('express-validator');
const QuestionModel = require("../model/QuestionModel");
const fetchuser = require("../middlewear/fetchuser")
const NotificationModel = require('../model/NotificationModel');
const MessageModel = require ('../model/MessageModel')
const PerformanceModel = require ("../model/PerformanceModel")
const EngagementModel = require('../model/EngagementModel');
const ScoreModel = require('../model/ScoreModel');
const mongoose = require('mongoose');
const PracticeSessionModel = require('../model/PracticeSessionModel')
const QuestionAnalysisModel = require('../model/QuestionAnalysisModel');
const fetchadmin = require("../middlewear/fetchuser")

// Create a new question
router.post('/CreateQuestion', fetchuser, [

  body('type').notEmpty().isIn(['MCQ', 'DESCRIPTIVE']),
  body('subject').notEmpty().isString(),
  body('topic').notEmpty().isString(),
  body('difficulty').notEmpty().isIn(['Easy', 'Medium', 'Hard']),
  body('questionText').notEmpty().isString(),
  body('option').if(body('type').equals('MCQ')).isArray(),
  body('descriptiveAnswer').if(body('type').equals('DESCRIPTIVE')).notEmpty().isString(),
  body('explanation').optional().isString(),
  body('correctAnswer').custom((value, { req }) => {
    if (req.body.type === 'MCQ') {
      // Ensure the correct answer is one of the provided options
      if (!req.body.option.includes(value)) {
        throw new Error('Correct answer must be one of the provided options');
      }
    }
    // No validation for descriptive questions regarding correctAnswer
    return true;
  })
 

  

], async (req, res) => {

  try {
    
    const {type,subject,topic,difficulty,questionText,option,correctAnswer,descriptiveAnswer, explanation} = req.body;

    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }



    // Prepare the question object for insertion based on type
    const questionData = {
      type,
      subject,
      topic,
      difficulty,
      questionText,
      explanation
    };

    if (type === 'MCQ' && option) {
      questionData.option = option;
      questionData.correctAnswer = correctAnswer;
    }

    if (type === 'DESCRIPTIVE') {
      questionData.descriptiveAnswer = descriptiveAnswer;
    }

 
    // Save the question to the database
    const newQuestion = new QuestionModel(questionData);
    const savedQuestion = await newQuestion.save();

    // Convert to an object and remove 'option' if the type is Descriptive
    const response = savedQuestion.toObject();
    if (response.type === 'DESCRIPTIVE') {
      delete response.option;
    }

    res.json(response);

  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }


});

// Read all questions or filter by subject/topic/difficulty
router.get('/getQuestion', fetchuser, async (req, res) => {
  const { subject, topic, difficulty } = req.query;
  const filter = {};
  if (subject) filter.subject = subject;
  if (topic) filter.topic = topic;
  // if (option) filter.option = option;
  if (difficulty) filter.difficulty = difficulty;

  try {
    const questions = await QuestionModel.find(filter);
    res.send(questions);
  } catch (error) {
    return res.status(500).send("Internel Server Error");
  }
});


// Update a question by ID

router.put('/UpdateQuestion/:id', fetchuser, async (req, res) => {
  try {
    const { type, subject, topic, difficulty, questionText, option, correctAnswer, descriptiveAnswer, explanation } = req.body;

    // Create an object to store the fields to be updated
    const updateQuestion = {};

    // Populate the update object with fields from the request body
    if (type) updateQuestion.type = type;
    if (subject) updateQuestion.subject = subject;
    if (topic) updateQuestion.topic = topic;
    if (difficulty) updateQuestion.difficulty = difficulty;
    if (questionText) updateQuestion.questionText = questionText;
    if (option) updateQuestion.option = option;
    if (correctAnswer) updateQuestion.correctAnswer = correctAnswer;
    if (descriptiveAnswer) updateQuestion.descriptiveAnswer = descriptiveAnswer;
    if (explanation) updateQuestion.explanation = explanation
    // Find the question by ID
    const question = await QuestionModel.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: "Question Not Found" });
    }

    // Update the question with the new data
    const updatedQuestion = await QuestionModel.findByIdAndUpdate(req.params.id, { $set: updateQuestion }, { new: true });
    if (!updatedQuestion) {
      return res.status(404).json({ msg: "Question Not Found" });
    }

    // Return the updated question
    res.json(updatedQuestion);

  } catch (error) {

    console.error(error.message);

    return res.status(500).send("Internal Server Error");
  }
  
});

// Delete a question by ID
router.delete('/DeleteQuestion/:id', fetchuser, async (req, res) => {
  try {

    let Question = await QuestionModel.findById(req.params.id)

    if (!Question) {

      return res.status(404).json("Question Not Found");
    }

    deleteQuestion = await QuestionModel.findByIdAndDelete(req.params.id)

    res.json(deleteQuestion)


  } catch (error) {

    console.error(error.message)
    
    return res.status(500).send("Internel Server Error");
  }
});

// API for admin to respond to a user message
router.post('/respondToMessage', async (req, res) => {
  const { messageId, adminResponse } = req.body;

  try {
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { adminResponse, isAdminResponse: true },
      { new: true } // Return the updated document
    );
    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(200).json({ success: true, message: 'Response sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send response' });
  }
});

// API to fetch all messages for admin
router.get('/getadminMessages', fetchadmin, async (req, res) => {
  try {
    // Fetch all messages from the database, sorted by timestamp
    const messages = await MessageModel.find().sort({ timestamp: 1 });

    if (!messages || messages.length === 0) {
      return res.status(200).json({ success: true, messages: [], message: 'No messages found' });
    }

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages for admin:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});



// API to send a notification (admin broadcast)
router.post('/sendNotification', fetchuser, async (req, res) => {



  const {studentId, title, message } = req.body; // Include studentId

  // Validate that studentId is provided
  if (!studentId || !title || !message) {
    return res.status(400).json({
      success: false,
      message: 'studentId,title, and message are required'
    });
  }

  try {
    const newNotification = new NotificationModel({ title, message, studentId:studentId }); // Include studentId
    await newNotification.save();
    res.status(200).json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }

});


// Increment usage count for a question
router.post('/increment-usage/:questionId', async (req, res) => {
  try {
      const { questionId } = req.params;
      await QuestionModel.findByIdAndUpdate(questionId, { $inc: { usageCount: 1 } });
      res.status(200).json({ message: 'Question usage incremented' });
  } catch (error) {
      res.status(500).json({ error: 'Error incrementing usage' });
  }
});

// Get usage count for a question
router.get('/get-usage/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await QuestionModel.findById(questionId).select('usageCount questionText');

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json({ usageCount: question.usageCount, questionText: question.questionText });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching usage count' });
  }
});




router.get('/get-latest-questions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // Default to 5 questions if no limit is specified

    const recentQuestions = await PracticeSessionModel.find({ status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(limit)
      .select('questions.questionId -_id'); // Select only the question IDs within the questions array

    if (!recentQuestions || recentQuestions.length === 0) {
      return res.status(404).json({ error: 'No recent questions found' });
    }

    // Flatten to an array of question IDs
    const questionIds = recentQuestions.flatMap(session => session.questions.map(q => q.questionId));

    res.status(200).json({ questionIds });
  } catch (error) {
    console.error("Error fetching recent questions:", error);
    res.status(500).json({ error: 'Error fetching recent questions' });
  }
});




// Store performance metrics after a session
router.post('/store-metrics', fetchuser, async (req, res) => {
  const {  sessionId, correctAnswers, incorrectAnswers, averageTimePerQuestion, totalScore } = req.body;

  const currentSessionId = sessionId || (practiceSession ? practiceSession._id : null);
  
  
  try {


     // If sessionId is not provided, attempt to find the session from the database
     if (!sessionId) {

     practiceSession = await PracticeSessionModel.findOne({ /* Your query criteria here */ });

    const currentSessionId = practiceSession ? practiceSession._id : null;
    }

    // Ensure sessionId is present
    if (!currentSessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

      const metrics = new PerformanceModel({
          studentId: req.user.id,
          sessionId: currentSessionId,
          correctAnswers,
          incorrectAnswers,
          averageTimePerQuestion,
          totalScore
      });
      await metrics.save();
      res.status(200).json({ message: 'Performance metrics stored' });
  } catch (error) {
    console.error('Error in store-metrics:', error);  // Log the error details

      res.status(500).json({ error: 'Error storing performance metrics' });
  }
});




router.get('/get-metrics/:sessionId', fetchuser, async (req, res) => {
  
    const { sessionId } = req.params;

    // Check if sessionId is valid (assuming MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: 'Invalid sessionId format' });
    }

    try {
      const metrics = await PerformanceModel.findOne({sessionId});
  
      if (!metrics) {
        return res.status(404).json({ error: 'Metrics not found' });
      }
      res.status(200).json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching performence metrics' });
    }
  });
  
  
  


router.post('/log-engagement', fetchuser, async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    const { action, timeSpent, sessionId } = req.body; // Ensure sessionId is included in the request
    console.log("Action:", action);
    console.log("Time Spent:", timeSpent);

    // Check if timeSpent is provided, and convert to seconds if necessary
    let timeInSeconds = Number(timeSpent) || 0; // Default to 0 if not provided

    console.log("Time in seconds:", timeInSeconds);

    // Check if the practice session exists
     practiceSession = await PracticeSessionModel.findOne({
      studentId: req.user.id,
      status: "in_progress"
    }).sort({ startedAt: -1 });

    console.log("Practice Session:", practiceSession);


    const currentSessionId = sessionId || (practiceSession ? practiceSession._id : null);

    const existingLog = await EngagementModel.findOne({
      studentId: req.user.id,
      sessionId: currentSessionId,
      action
    });

      // If the log exists, avoid creating a duplicate
      if (existingLog) {
        return res.status(200).json({ message: 'Engagement log already exists' });
      }


    const log = new EngagementModel({
      studentId: req.user.id,
      action,
      timeSpent: timeInSeconds,
      sessionId:  currentSessionId // Corrected reference to practiceSession
    });


    await log.save();
    res.status(200).json({ message: 'Engagement log created' });
  } catch (error) {
    console.error("Error logging engagement:", error);
    res.status(500).json({ error: 'Error logging engagement' });
  }
});





// Get engagement logs for a session, student, or all engagements
router.get('/get-engagements', fetchuser, async (req, res) => {
  try {
    const { sessionId, studentId } = req.query;
    
    let query = {};

    // If sessionId is provided in query, filter by sessionId
    if (sessionId) query.sessionId = sessionId;

    // If studentId is provided in query, filter by studentId
    if (studentId) query.studentId = studentId;

    // Fetch all engagements if no filters are applied, otherwise apply the filters
    const engagementLogs = await EngagementModel.find(query);

    if (!engagementLogs || engagementLogs.length === 0) {
      return res.status(404).json({ error: 'No engagement logs found' });
    }

    res.status(200).json(engagementLogs);
  } catch (error) {
    console.error('Error fetching engagement logs:', error);
    res.status(500).json({ error: 'Error fetching engagement logs' });
  }
});




// Save score distribution after an exam
router.post('/score-distribution',fetchuser, async (req, res) => {
   const { sessionId, scoreRanges } = req.body;

  // Check if the practice session exists
  practiceSession = await PracticeSessionModel.findOne({
    studentId: req.user.id,
    status: "completed",
  }).sort({ completedAt: -1 });

  console.log("Score Session:", practiceSession);


  

  const scoreSessionId = sessionId || (practiceSession ? practiceSession._id : null);

  if (!scoreSessionId) {
    return res.status(404).json({ error: 'No valid session ID found' });
  }




  const existingScore = await ScoreModel.findOne({
    studentId: req.user.id,
    sessionId: scoreSessionId
  });

    // If the log exists, avoid creating a duplicate
    if (existingScore) {
      return res.status(200).json({ message: 'Score already exists' });
    }



  try {
      const distribution = new ScoreModel({
          studentId:req.user.id,
          sessionId:scoreSessionId,
          scoreRanges
      });
      await distribution.save();
      res.status(200).json({ message: 'Score distribution saved' });
  } catch (error) {
      res.status(500).json({ error: 'Error saving score distribution' });
  }
});


// Fetch score distribution for a specific session
router.get('/score-distribution/:sessionId',fetchuser, async (req, res) => {
  const { sessionId } = req.params;

  // Check if sessionId is valid (assuming MongoDB ObjectId)
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    return res.status(400).json({ error: 'Invalid sessionId format' });
  }

  try {
    const distribution = await ScoreModel.findOne({sessionId});

    if (!distribution) {
      return res.status(404).json({ error: 'Score distribution not found' });
    }
    res.status(200).json(distribution);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching score distribution' });
  }
});





// Fetch the latest completed session
router.get('/latest-session', async (req, res) => {
  try {
    // Use query parameters instead of body in a GET request
    const { sessionId } = req.query;

    let latestSessionId = sessionId;

    // If sessionId is not provided, find the latest completed session from the database
    if (!sessionId) {
      const practiceSession = await PracticeSessionModel.findOne({
        // Add your query criteria here to find the latest session
        status: 'completed'  // Example: looking for completed sessions
      }).sort({ completedAt: -1 }); // Sort by completedAt to get the most recent one

      // Assign the latest session ID if found
      latestSessionId = practiceSession ? practiceSession._id : null;
    }

    // If no session is found, return an error
    if (!latestSessionId) {
      return res.status(404).json({ error: 'No completed session found' });
    }

    // Return the latest session ID
    res.status(200).json({ sessionId: latestSessionId });
  } catch (error) {
    console.error("Error fetching the latest session:", error);
    res.status(500).json({ error: 'Error fetching the latest session' });
  }
});




router.post('/question-analysis', async (req, res) => {
  const { questionId, correctResponses = 0, incorrectResponses = 0 } = req.body;

  try {
    // Validate the questionId
    if (!mongoose.isValidObjectId(questionId)) {
      return res.status(400).json({ error: 'Invalid question ID' });
    }

    // Check if the practice session exists
    const practiceSession = await PracticeSessionModel.findOne({
      questionId: questionId, // Ensure you're checking the correct field
      status: "completed",
    }).sort({ completedAt: -1 });

    console.log("Analysis:", practiceSession);

    // Increment correctResponses or incorrectResponses only if they are provided
    const updateFields = {};
    if (correctResponses > 0) {
      updateFields.correctResponses = correctResponses;
    }
    if (incorrectResponses > 0) {
      updateFields.incorrectResponses = incorrectResponses;
    }

    const analysisQuestionId = questionId || (practiceSession ? practiceSession._id : null);

    if (!analysisQuestionId) {
      return res.status(404).json({ error: 'No valid question ID found' });
    }

    // Perform upsert (update if exists, otherwise insert)
    const analysis = await QuestionAnalysisModel.findOneAndUpdate(
      { questionId: analysisQuestionId }, // Use the derived analysisQuestionId
      { $inc: updateFields }, // Increment only the provided fields
      { new: true, upsert: true }
    );

    // Return the updated or inserted analysis
    res.status(200).json({ message: 'Question analysis updated', analysis });
  } catch (error) {
    console.error('Error updating question analysis:', error.message);
    res.status(500).json({ error: 'Error updating question analysis' });
  }
});


// Get question analysis by questionId
router.get('/question-analysis/:questionId', async (req, res) => {
  const { questionId } = req.params;

  try {
    // Check if questionId is valid
    if (!mongoose.isValidObjectId(questionId)) {
      return res.status(400).json({ error: 'Invalid questionId' });
    }

    // Find the analysis data for the given questionId
    const analysis = await QuestionAnalysisModel.findOne({ questionId });
    
    if (!analysis) {
      return res.status(404).json({ error: 'Question analysis not found' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error fetching question analysis:', error.message);
    res.status(500).json({ error: 'Error fetching question analysis' });
  }
});




module.exports = router; 
