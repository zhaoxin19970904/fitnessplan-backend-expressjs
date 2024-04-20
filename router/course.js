const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');

//create a new Course
router.post('/course', async (req, res) => {
    try {
      const newCourse = new Course(req.body);
      await newCourse.save();
      res.json({ message: "New course created", course: newCourse });
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  
  
 //select all course from Course Database 
  router.get('/courses', async (req, res) => {
    try {
      const courses = await Course.find({isDeleted:false});
  
      res.json(courses);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  

  //select course by id
  router.get('/courses/:id', async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      res.status(600).json({ message: 'Error retrieving course' });
    }
  });
  

  //select all the course with student id
  router.get('/personcourse/:id', async (req, res) => {
    try {
      const studentId = req.params.id;
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(405).json({ message: 'Student not found' });
      }
  
      const courseName = student.course;
      const courseIds = courseName.map(course => course.id);
      const course = await Course.find({_id: { $in: courseIds }})
      res.json(course);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving course', error: error.message });
    }
  });
  

  //add the course with student id and course id
  router.post('/personadd/:id/:cid', async (req, res) => {
    try {
      const studentId = req.params.id;
      const courseId = req.params.cid;
  
  
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      const courseList = student.course;
      if(courseList.length < 5) {
   
        const course = await Course.findById(courseId);
        if (course) {
          if (courseList.some(courseItem => courseItem.name === course.name)) {
            return res.status(400).json({ message: 'The course is already in your list' });
          }
          const currentTime = new Date();
          const courseStartTime = new Date(course.start);
          if (currentTime > courseStartTime) {
            return res.status(400).json({ message: 'Cannot add course past its start time' });
          }
          courseList.push({ name: course.name, id: course._id });
          await student.save();
          if (student.type === 'student') {
            const isEnrolled = course.enrolledStudents.some(enrolled => enrolled.id.toString() === studentId);
            if (!isEnrolled) {
              course.enrolledStudents.push({ id: studentId, pay: false });
              await course.save();
            }
          } else if (student.type === 'teacher' && !course.isTeach) {
            course.isTeach = true;
            course.tid = studentId;
            await course.save();
          }
          res.json({ message: 'Course added successfully' });
        } else {
          return res.status(404).json({ message: 'Course not found' });
        }
      } else {
        return res.status(400).json({ message: 'Maximum of 5 courses allowed' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message:'Error updating student with course' });
  }
  });
  

  //change the state of pay with studnet id and course id
  router.post('/personpay/:id/:cid', async (req, res) => {
    try {
      const studentId = req.params.id;
      const courseId = req.params.cid;
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      const studentIndex = course.enrolledStudents.findIndex(student => student.id.toString() === studentId);
      if (studentIndex === -1) {
        return res.status(404).json({ message: 'Student not enrolled in course' });
      }
      course.enrolledStudents[studentIndex].pay = true;
    course.markModified('enrolledStudents');
    await course.save();
  
      res.json({ message: 'Payment status updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating payment status' });
    }
  });
  

  //remove the course by id from the student course list by student id
  router.post('/personremove/:id/:cid', async (req, res) => {
    try {
      const studentId = req.params.id;
      const courseId = req.params.cid;
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      student.course = student.course.filter(courseItem => courseItem.id.toString() !== courseId);
      await student.save();
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      if (student.type === 'teacher') {
        course.isTeach = false;
        course.tid = null;
      } else {
  
        course.enrolledStudents = course.enrolledStudents.filter(enrolledStudent => enrolledStudent.id.toString() !== studentId);
      }
      await course.save();
      res.json({ message: 'Course removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error removing course from student' });
    }


    //delete the course by id(change the state of isDeleted)
    router.post('/deletec/:id',async(req,res)=>{
        try {
          const courseId = req.params.id;
      
          const result = await Course.findByIdAndUpdate(courseId,{ isDeleted: true });
      
          if (!result) {
            return res.status(404).json({ message: 'Course not found' });
          }
      
          res.json({ message: "Course deleted successfully" });
        } catch (error) {
          res.status(500).json({ message: "Error deleting course" });
        }
      })

      //update the state of course
      router.post('/updatec/:id',async (req,res)=>{
        try {
          const studentId = req.params.id;
          const { ...updateData } = req.body;
      
        
          const updatedStudent = await Course.findByIdAndUpdate(studentId, updateData, { new: true });
      
          if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
          }
      
          res.json({ message: "Student updated successfully", student: updatedStudent });
        } catch (error) {
          res.status(500).send(error);
        }
      })
  });

  module.exports = router;