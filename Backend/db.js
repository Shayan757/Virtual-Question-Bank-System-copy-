const mongoose = require('mongoose');
const mongooseUrl = "mongodb://localhost:27017/VirtualQuestionBankSystem"

const ConnectToMongo = async()=>{

   await mongoose.connect (mongooseUrl)
        console.log("Connected to Mongo Successfully");
}


module.exports = ConnectToMongo