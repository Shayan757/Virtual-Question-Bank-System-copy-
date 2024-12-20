

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ScoreRangeSchema = new Schema({
  range: { type: String, required: true }, // e.g., "0-50"
  count: { type: Number, required: true }  // The count for that range
});

const ScoreDistributionSchema = new Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },
  sessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PracticeSession', 
    required: true 
  },
  scoreRanges: [ScoreRangeSchema] // Array of score ranges
});

const ScoreModel = mongoose.model('ScoreDistribution', ScoreDistributionSchema);

module.exports = ScoreModel;
