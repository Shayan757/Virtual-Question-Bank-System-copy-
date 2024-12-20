
const mongoose = require('mongoose');
const { Schema } = mongoose;


const PerformanceMetricsSchema = new Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PracticeSession' },
    correctAnswers: { type: Number },
    incorrectAnswers: { type: Number },
    averageTimePerQuestion: { type: Number },
    totalScore: { type: Number },
    date: { type: Date, default: Date.now },
  });
  
  const PerformanceModel = mongoose.model('PerformanceMetrics', PerformanceMetricsSchema);

module.exports = PerformanceModel;