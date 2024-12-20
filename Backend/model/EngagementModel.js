const mongoose = require('mongoose');
const { Schema } = mongoose;

const EngagementSchema = new Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },
  action: { 
    type: String, 
    required: true, 
    enum: [ 'start_practice', 'completed'],
     
  },
  
  timeSpent: { 
    type: Number, 
    default: 0  // Time spent in seconds
  },
  date: { 
    type: Date, 
    default: Date.now  // Log the timestamp of the action
  },
  sessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PracticeSession',  // To link engagement to specific sessions
    required: false  // Optional depending on the action
  },
  // You can add other fields like 'platform', 'device' if needed
});

const EngagementModel = mongoose.model('Engagement', EngagementSchema);

module.exports = EngagementModel;

