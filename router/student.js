const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Adjust the path as necessary

// Add all student-related routes here
router.post('/student', async (req, res) => {
    try {

        const newStudent = new Student(req.body);
        await newStudent.save();
        res.json({ message: "New student created", student: newStudent });
      } catch (error) {
        res.status(500).send(error);
      }
});


//update the state of student by id
router.post('/update/:id',  async (req, res) => {
    try {
        const studentId = req.params.id;
        const { ...updateData } = req.body;
    
      
        const updatedStudent = await Student.findByIdAndUpdate(studentId, updateData, { new: true });
    
        if (!updatedStudent) {
          return res.status(404).json({ message: 'Student not found' });
        }
    
        res.json({ message: "Student updated successfully", student: updatedStudent });
      } catch (error) {
        res.status(500).send(error);
      }
});


//delete the user by id (update state of isDeleted)
router.post('/delete/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
    
        const result = await Student.findByIdAndUpdate(studentId, { isDeleted: false });
    
    
        if (!result) {
          return res.status(404).json({ message: 'Student not found' });
        }
    
        res.json({ message: "Student deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting student" });
      }
});


//selet all user
router.get('/students',  async (req, res) => {
    try {
        const students = await Student.find({ type: 'student' ,isDeleted:false});
        res.json(students);
      } catch (error) {
        res.status(500).send(error);
      }
});


//select user by id
router.get('/students/:id',  async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId);
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
      } catch (error) {
        res.status(500).json({ message: 'Error retrieving student' });
      }
});


module.exports = router;