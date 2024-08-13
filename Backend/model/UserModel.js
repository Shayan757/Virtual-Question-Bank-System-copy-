const mongoose = require('mongoose');
const { Schema } = mongoose;
const {roles} = require("../utils/constant")

const UserSchema = new Schema({
  name: {
    
   type : String,
   required : true

  },

  email: {
    
    type : String,
    required : true,
    unique : true
 
   },


   password: {
    
    type : String,
    required : true
 
   },

   roles : {

    type : String,

    enum : [roles.admin , roles.student],

    default : roles.student

   },

  date: { type: Date, default: Date.now },
  hidden: Boolean,
  
});

const user = mongoose.model('User', UserSchema);

module.exports = user