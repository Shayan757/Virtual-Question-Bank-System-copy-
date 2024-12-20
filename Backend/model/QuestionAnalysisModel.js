
const mongoose = require('mongoose');
const { Schema } = mongoose;




const QuestionAnalysisSchema = new Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PracticeSession', require: true },
    correctResponses: { type: Number , default: 0 },
    incorrectResponses: { type: Number , default: 0 },
  });
  
   
  const QuestionAnalysisModel = mongoose.model('QuestionAnalysis', QuestionAnalysisSchema);

module.exports = QuestionAnalysisModel;