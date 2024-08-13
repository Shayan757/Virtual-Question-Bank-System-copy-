const mongoose = require ('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({

    admin : {

        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },


    type: { type: String, required: true, enum: ['mcq', 'descriptive'] },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
    questionText: { type: String, required: true },
    option: {
        type: [String],
        required: function () { return this.type === 'mcq'; }
      },
    correctAnswer: {type: String, required: true}, // Only for MCQs
    descriptiveAnswer: {type: String}, // Only for descriptive questions
  
  
  
});

module.exports = mongoose.model('Question', QuestionSchema);