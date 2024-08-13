const express = require('express'); 
const router = express.Router();
const { body, validationResult } = require('express-validator');
const QuestionModel = require("../model/QuestionModel");
const fetchuser = require("../middlewear/fetchuser")



// Create a new question
router.post('/CreateQuestion', fetchuser, [

  body('type').notEmpty().isIn(['mcq', 'descriptive']),
  body('subject').notEmpty().isString(),
  body('topic').notEmpty().isString(),
  body('difficulty').notEmpty().isIn(['easy', 'medium', 'hard']),
  body('questionText').notEmpty().isString(),
  body('option').if(body('type').equals('mcq')).isArray(),
  body('descriptiveAnswer').optional().isString(), // Make descriptiveAnswer optional
  body('correctAnswer').custom((value, { req }) => {
    if (req.body.type === 'mcq') {
      if (!req.body.option.includes(value)) {
        throw new Error('Correct answer must be one of the provided options');
      }
    } else if (!value || typeof value !== 'string') {
      throw new Error('Correct answer is required for descriptive questions');
    }
    return true;

  })

  

], async (req, res) => {

  try {
    
    const {type,subject,topic,difficulty,questionText,option,correctAnswer,descriptiveAnswer} = req.body;

    const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.send({ errors: errors.array() });
  }

  const Question = new QuestionModel({


  type,
  subject,
  topic,
  difficulty,
  questionText,
  option: type === 'mcq' ? option : undefined,  // Only include options if it's an MCQ
  correctAnswer,
  descriptiveAnswer: type === 'descriptive' ? descriptiveAnswer : undefined // Only include descriptiveAnswer if it's a descriptive question


  });

 
const savedQuestion = await Question.save()

res.json(savedQuestion);


  } catch (error) {

    console.error(error.message)

    return res.status(500).send("Internel Server Error");
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

// Read a question by ID
router.get('/ReadQuestion/:id',fetchuser, async (req, res) => {
  try {
    const question = await QuestionModel.findById(req.params.id);
    if (!question) return res.status(404).json("Question not found");
    res.send(question);
  } catch (error) {
    return res.status(500).send("Internel Server Error");
  }
});

// Update a question by ID

router.put('/UpdateQuestion/:id', fetchuser, async (req, res) => {
  try {
    const { type, subject, topic, difficulty, questionText, option, correctAnswer, descriptiveAnswer } = req.body;

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







module.exports = router; 
