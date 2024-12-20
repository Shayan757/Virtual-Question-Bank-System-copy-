const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const router = express.Router();
const fetchuser = require ('../middlewear/fetchuser')
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const UserModel = require("../model/UserModel")
const { roles } = require("../utils/constant");
const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Types;
const QuestionModel = require("../model/QuestionModel");
const PracticeSessionModel = require("../model/PracticeSessionModel");
const MessageModel = require('../model/MessageModel');
const NotificationModel = require('../model/NotificationModel');
const upload = require ('../middlewear/multer')
// Student Register //

router.post("/register",[

    
 
    body("name" , "Enter a valid name").isLength({min:3}),
    body("email" , "Enter a valid email").isEmail(),
    body("password" , "Enter a valid password").isLength({min:5})

], async(req,res)=>{

  let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

      let user = await UserModel.findOne({email:req.body.email})

      if (user) {

        return res.status(409).json("This email is already exist");
        
      }

      const salt = await bcrypt.genSalt(10);
      const hashpass = await bcrypt.hash(req.body.password, salt);

      const userRole = (req.body.email === process.env.ADMIN_EMAIL) ? roles.admin : roles.student;


    user = await UserModel.create({

        name : req.body.name,
        email : req.body.email,
        password :hashpass,
        roles : userRole
      });


      const data = {

         user: {

        id : user.id,
        roles : user.roles
        
      }
    }


    const authtoken = jwt.sign( data, process.env.JWT_SECRET);
    success = true;

    res.json({success,authtoken,user: data.user})

        
    } catch (error) {

      console.error(error.message)

      return res.status(500).send("Internel server error")

        
    }
      
  

}); 


// login //


router.post("/login",[
 
  body("email" , "Enter a valid email").isEmail(),
  body("password" , "Enter a valid password").isLength({min:5})

], async(req,res)=>{

  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password} = req.body;


  try {

    let user = await UserModel.findOne({email})

    if (!user) {

      return res.status(401).json("Enter with correct credentials");
      
    }


    const ComparePassword = await bcrypt.compare(password , user.password)


    if (!ComparePassword) {

      return res.status(401).json("Enter with correct credentials");
      
    }

    
    const userRole = (req.body.email === process.env.ADMIN_EMAIL) ? roles.admin : roles.student;
  

    const data = {

       user: {

      id : user.id,
      roles : userRole
      
    }
  }


  const authtoken = jwt.sign( data, process.env.JWT_SECRET);
 success = true;
  res.json({success,authtoken, user: data.user})

      
  } catch (error) {

    console.error(error.message)

    return res.status(500).send("Internel server error")

      
  }
  


});

// get user //

router.get("/getuser", fetchuser, async(req,res) => {
  try {
    // Check if the logged-in user is an admin
   

    // Fetch all users from the database, excluding passwords
    let users = await UserModel.find().select('-password');  

    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error");
  }
});



// User update //


router.put('/updateUser/:id', [
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Enter a valid password").isLength({ min: 5 })
], async (req, res) => {

  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, email, password, roles } = req.body;

    // Find the user by ID
    let user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (roles) user.roles = roles;

    // Save the updated user
    await user.save();

    success = true;
    res.json({ success, user });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Delete user //


router.delete("/deleteUser/:id", async(req,res)=>{

  

  try {

    

    const userId = req.params.id;

     
    

    

    let existingUser = await UserModel.findById(userId);

    if (!existingUser) {
        return res.status(404).json("User not found");
    }


    existingUser = await UserModel.findByIdAndDelete(userId)

    res.json({existingUser}); 
      
  } catch (error) {

    console.error(error.message)

    return res.status(500).send("Internel server error")
      
  }  

});





// Create Profile Setting API
router.post('/profileSetting', fetchuser, upload.single('profilePicture'), [
  body("username").optional().isString().withMessage("Provide a valid username"),
  body("phoneNumber").optional().isMobilePhone().withMessage("Provide a valid phone number"),
  body("dateOfBirth").optional().isDate().withMessage("Provide a valid date of birth"),
  body("institution").optional().isString().withMessage("Provide a valid institution name"),
  body("gradeYear").optional().isString().withMessage("Provide a valid grade or year"),
  body("subjectsOfInterest").optional().isArray().withMessage("Provide a list of subjects"),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username,phoneNumber, dateOfBirth, institution, gradeYear, subjectsOfInterest } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : ''; // return the relative URL


    // Check if user already has a profile
    let user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user with profile fields
    user.profilePicture = profilePicture;
    user.username = username || '',
    user.phoneNumber = phoneNumber || '';
    user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    user.institution = institution || '';
    user.gradeYear = gradeYear || '';
    user.subjectsOfInterest = subjectsOfInterest || [];

    await user.save();

    res.status(201).json({ success: true, message: "Profile created successfully", profile: user });



  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});



// Get Profile API
router.get('/getprofile', fetchuser, async (req, res) => {
  try {
    // Fetch user by ID from the database
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send user data including the profile picture URL
    res.json({
      success: true,
      profile: {
        userId: user._id,  // Add userId here
        username: user.username, // Include name here
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        institution: user.institution,
        gradeYear: user.gradeYear,
        subjectsOfInterest: user.subjectsOfInterest,
        profilePicture: user.profilePicture ? user.profilePicture : '' // Include the profile picture URL
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});




// Delete Profile Setting API
router.delete('/profileSettingdelete/:id',fetchuser, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    let user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Clear profile fields
    user.profilePicture = '';
    user.username = '';
    user.phoneNumber = '';
    user.dateOfBirth = null;
    user.institution = '';
    user.gradeYear = '';
    user.subjectsOfInterest = [];

    await user.save();

    res.json({ success: true, message: "Profile deleted successfully" });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});





// Get filtered questions with performance insights
router.get('/getQuestions', fetchuser, async (req, res) => {
  try {
    const { subject, topic, difficulty, type, performanceFilter } = req.query;
    const filter = {};

    // Apply filters only if they are present in the query
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;

    // Fetch filtered questions
    const questions = await QuestionModel.find(filter);

    if (performanceFilter === 'incorrect') {
      // Fetch user performance data and filter out questions answered incorrectly
      const sessions = await PracticeSessionModel.find({
        studentId: req.user.id,
        'questions.selectedAnswer': { $ne: 'correct' }
      }).populate('questions.questionId');

      const incorrectQuestions = sessions.flatMap(session =>
        session.questions.filter(q => q.selectedAnswer !== q.questionId.correctAnswer).map(q => q.questionId)
      );

      return res.json(incorrectQuestions);
    }

    res.json(questions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});



// Start a practice session
router.post('/startPractice', fetchuser, async (req, res) => {
  try {
    const { questionIds, timeLimit } = req.body;

    // Debugging log
    console.log('Starting practice with:', { questionIds, timeLimit });

    // Check if there's already an active session for this student with the same set of questions
    const existingSession = await PracticeSessionModel.findOne({
      studentId: req.user.id,
      'questions.questionId': { $all: questionIds }, // Check if all questionIds match
      status: 'in_progress'
    });

    if (existingSession) {
      return res.status(400).json({ message: 'You already have an active session with the same questions.' });
    }

    const newSession = new PracticeSessionModel({
      studentId: req.user.id,
      questions: questionIds.map(id => ({ questionId: id })), // Map questionIds into question objects
      timeLimit,
      startedAt: new Date(),
      completedAt: Date(),
      status: 'in_progress',
    });

    const savedSession = await newSession.save();

    // Log success
    console.log('Practice session saved:', savedSession);

    res.json(savedSession);
  } catch (error) {
    console.error('Error in /startPractice:', error.message); // Log the specific error message
    res.status(500).send('Internal Server Error');
  }
});







// submitAnswer //

router.post('/submitAnswers', fetchuser, async (req, res) => {
  try {
    const { sessionId, answers } = req.body;

    // Log the incoming sessionId and answers
    console.log('Received sessionId:', sessionId);
    console.log('Received answers:', answers);

    // Validate sessionId is a valid ObjectId or hex string
    if (!mongoose.isValidObjectId(sessionId)) {
      return res.status(400).json({ error: 'Invalid sessionId' });
    }

    // Fetch the session with populated questions
    const session = await PracticeSessionModel.findById(sessionId).populate('questions.questionId');

    if (!session) {
      return res.status(404).json({ error: 'Practice session not found' });
    }

    let score = 0; // Initialize score
    let totalQuestions = session.questions.length;

    // Prepare report for each question
    const report = session.questions.map(question => {
      const answer = answers.find(a => {
        // Check if the questionId is valid and matches the session questionId
        return mongoose.isValidObjectId(a.questionId) && question.questionId._id.equals(a.questionId);
      });

      
      if (answer) {
        // Update selectedAnswer
        question.selectedAnswer = answer.selectedAnswer;
      
        // Check if the question type is "DESCRIPTIVE"
        if (question.questionId.type === 'DESCRIPTIVE') {
          // Normalize both selected and correct answers for comparison
          const normalize = (str) => str.trim().toLowerCase();
          const isCorrect = normalize(question.selectedAnswer) === normalize(question.questionId.descriptiveAnswer);
      
          // Increment score if the descriptive answer is correct
          if (isCorrect) {
            score++;
          }
      
          // Return the result for descriptive question
          return {
            questionId: question.questionId._id, // Include questionId
            questionText: question.questionId.questionText,
            selectedAnswer: question.selectedAnswer,
            descriptiveAnswer: question.questionId.descriptiveAnswer, // Correct descriptive answer
            explanation: question.questionId.explanation,
            isCorrect,
          };
        } else {
          // For non-descriptive questions, compare with correctAnswer
          const isCorrect = question.selectedAnswer === question.questionId.correctAnswer;
      
          // Increment score if the answer is correct
          if (isCorrect) {
            score++;
          }
      
          // Return the result for non-descriptive questions
          return {
            questionId: question.questionId._id, // Include questionId
            questionText: question.questionId.questionText,
            selectedAnswer: question.selectedAnswer,
            correctAnswer: question.questionId.correctAnswer, // Correct answer for multiple-choice
            explanation: question.questionId.explanation,
            isCorrect,
          };
        }
      }


      return null; // Return null if no answer was found
    }).filter(Boolean); // Filter out any null values

    // Calculate accuracy
    const accuracy = (score / totalQuestions) * 100;

    // Calculate time taken to complete the session
    const completedAt = new Date();
    const timeTaken = Math.round((completedAt - session.startedAt) / 1000); // Convert ms to sec

    // Update session with the final score, mark as 'completed', and save timeTaken and completedAt
    session.status = 'completed';
    session.score = score;
    session.completedAt = completedAt;
    await session.save();

    // Return the report along with the final score, time taken, and accuracy
    res.json({
      message: 'Answers submitted successfully',
      score,
      accuracy: `${accuracy.toFixed(2)}%`, // Return accuracy as a percentage
      timeTaken, 
      report,
    });
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});



// API to send a message (user to support)
router.post('/sendMessage', fetchuser, async (req, res) => {
  const { message } = req.body;

  // Basic validation to check if studentId and message are provided
  if ( !message) {
    return res.status(400).json({ success: false, message: 'messages are required' });
  }

  try {
    // Create a new message document
    const newMessage = new MessageModel({ message, studentId:req.user.id });

    // Save the message to the database
    await newMessage.save();

    // Respond with success if message is saved
    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    // Log error for debugging
    console.error('Error saving message:', error);

    // Respond with failure message if an error occurs
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});




// API to fetch all messages for a user
router.get('/getMessages', fetchuser, async (req, res) => {
  

  try {
    

     // Fetch messages from the database for the authenticated user, sorted by timestamp
     const messages = await MessageModel.find({ studentId: req.user.id }).sort({ timestamp: 1 });


    // If no messages are found, return a friendly message
    if (!messages || messages.length === 0) {
      return res.status(200).json({ success: true, messages: [], message: 'No messages found' });
    }

    // Return the fetched messages
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching messages:', error);

    // Return a failure response if something goes wrong
    return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});



// API to mark a notification as read
router.post('/markNotificationRead', async (req, res) => {
  const { notificationId } = req.body;

  try {
    await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true });
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
});



// API to get notifications
router.get('/getNotifications', fetchuser, async (req, res) => {
  

  try {
    // Find notifications associated with the provided studentId
    const notifications = await NotificationModel.find({ studentId: req.user.id }).sort({ timestamp: -1 }); // Sort by timestamp, most recent first

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve notifications' });
  }
});







module.exports = router; 
