const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },

  type: {
    type: String,
    required: true,
    enum: ['MCQ', 'DESCRIPTIVE']
  },
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  questionText: {
    type: String,
    required: true
  },
  option: {
    type: [String],
    required: function () { return this.type === 'MCQ'; },
    default: undefined // Corrected: Add missing comma
  },
  correctAnswer: {
    type: String,
    required: function () { return this.type === 'MCQ'; }
  }, // Only for MCQs
  descriptiveAnswer: {
    type: String
  }, // Only for descriptive questions

  explanation: {
    type: String,
    required: true
  },

  usageCount: { type: Number, default: 0 },  // New field for tracking usage
  createdAt: { type: Date, default: Date.now }, // Automatically sets creation date


});

module.exports = mongoose.model('Question', QuestionSchema);
