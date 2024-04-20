const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: String,
    des:String,
    credit:Number,
    start:Date,
    end:Date,
    isTeach:{
        type:Boolean,
        default:false
    },
    tid:String,
    enrolledStudents:{
      type:Array,
      default:[]
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  });
  const Course = mongoose.model('Course', CourseSchema, 'course');
  module.exports = Course;
  