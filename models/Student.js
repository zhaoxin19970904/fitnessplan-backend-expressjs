const mongoose = require('mongoose');

// Define the student schema
const StudentSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    gender: String,
    type: String,
    birth: Date,
    age:Number,
    course:{
      type:Array,
      default:[]
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  });


// Create the model from the schema
const Student = mongoose.model('Student', StudentSchema, 'student');

module.exports = Student;