

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the PracticeSession schema
const PracticeSessionSchema = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Assuming you have a User model
    required: true,
  },
  questions: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // Assuming you have a Question model
        required: true,
      },
      selectedAnswer: {
        type: String, // The answer selected by the user
        required: false, // Initially, this will be empty and filled on answer submission
      },
    },
  ],
  timeLimit: {
    type: Number, // Time limit in minutes
    required: true,
  },
  startedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  completedAt: {
    type: Date, // Timestamp for when the session is completed
    required: false,
  },

  
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'terminated'],
    default: 'in_progress',
  },
  score: {
    type: Number, // Store the final score for the session
    default: 0,
  },
});

const PracticeSessionModel = mongoose.model('PracticeSession', PracticeSessionSchema);

module.exports = PracticeSessionModel;
