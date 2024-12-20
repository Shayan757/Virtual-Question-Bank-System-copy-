

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { roles } = require("../utils/constant");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: String,
    enum: [roles.admin, roles.student],
    default: roles.student
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  profilePicture: {
    type: String,
    default: ''
  },

  username: {

    type:String,
    default:''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  institution: {
    type: String,
    default: ''
  },
  gradeYear: {
    type: String,
    default: ''
  },
  subjectsOfInterest: {
    type: [String],
    default: []
  }
});

const user = mongoose.model('user', UserSchema);

module.exports = user;
