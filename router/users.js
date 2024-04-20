const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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

router.post('/delete/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
    
        const result = await Student.findByIdAndUpdate(studentId, { isDeleted: true });
    
    
        if (!result) {
          return res.status(404).json({ message: 'Student not found' });
        }
    
        res.json({ message: "Student deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting student" });
      }
});

router.get('/students',  async (req, res) => {
    try {
        const students = await Student.find({ type: 'student' ,isDeleted:false});
        res.json(students);
      } catch (error) {
        res.status(500).send(error);
      }
});

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

router.get('/admins',  async (req, res) => {
    try {
      const pageSize = parseInt(req.query.pageSize) || 2; 
      const page = parseInt(req.query.page) || 1;
      const students = await Student.find({ type: 'admin', isDeleted: false });
      const totalItems = students.length; // Define totalItems
      const totalPages = Math.ceil(totalItems / pageSize);
  
      if (page > totalPages) {
        return res.status(404).send('Page not found');
      }
  
      const startIndex = (page - 1) * pageSize;
      const paginatedStudents = students.slice(startIndex, startIndex + pageSize);
  
      res.json({
        totalPages: totalPages,
        currentPage: page,
        pageSize:pageSize,
        totalItems: totalItems,
        students: paginatedStudents
      });
    } catch (error) {
      console.error(error); // Log the error
      res.status(500).send("An error occurred on the server"); // Send a generic error message
    }
  });
  

// function arr(array){
//   array.forEach((a)=>{
//     a.name : age,
//     a.function : include,
//     a.value : admin
//     let username=a.name

//     if(){
//       let query={username : xxxx}
//     }
//   })
// }

function searchname(data) {
  let query = { type: 'admin', isDeleted: false };

  data.forEach((item) => {

  if (item.fun === 'equal') {
    query = { ...query, [item.name]: item.value };
  } else if (item.fun === 'include') {
    query = { ...query, [item.name]: { $regex: item.value, $options: 'i' } };
  } else if (item.fun === 'greater') {
    query = { ...query, [item.name]: { $gt: item.value } };
  } else if (item.fun === 'less') {
    query = { ...query, [item.name]: { $lt: item.value } };
  }
});

return query;
}
  router.post('/adminssearch', async (req, res) => {
    try {
      const pageSize = parseInt(req.query.pageSize) || 2; 
      const page = parseInt(req.query.page) || 1;
      const data = req.body; //{username:xxx,age:xx,gender:xxx}
      console.log(data)
      let query = searchname(data)
      console.log(query)
  
      const totalItems = await Student.countDocuments(query);
      const totalPages = Math.ceil(totalItems / pageSize);
  
      if (page > totalPages) {
        return res.status(404).send('Page not found');
      }
  
      const startIndex = (page - 1) * pageSize;
      const paginatedStudents = await Student.find(query)
                                             .skip(startIndex)
                                             .limit(pageSize);
  
      res.json({
        totalPages: totalPages,
        currentPage: page,
        pageSize: pageSize,
        totalItems: totalItems,
        students: paginatedStudents
      });
    } catch (error) {
      console.error(error); // Log the error
      res.status(500).send("An error occurred on the server"); // Send a generic error message
    }
  });



  
  router.get('/admins/search/:name',  async (req, res) => {
    const sname = req.params.name;
    try {
      const pageSize = parseInt(req.query.pageSize) || 2; 
      const page = parseInt(req.query.page) || 1;
      const students = await Student.find({ type: 'admin', isDeleted: false, username: sname });
      const totalItems = students.length; // Define totalItems
      const totalPages = Math.ceil(totalItems / pageSize);
  
      if (page > totalPages) {
        return res.status(404).send('Page not found');
      }
  
      const startIndex = (page - 1) * pageSize;
      const paginatedStudents = students.slice(startIndex, startIndex + pageSize);
  
      res.json({
        totalPages: totalPages,
        currentPage: page,
        totalItems: totalItems,
        students: paginatedStudents
      });
    } catch (error) {
      console.error(error); // Log the error
      res.status(500).send("An error occurred on the server"); // Send a generic error message
    }
  });
  router.post('/update/:id',async (req,res)=>{
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
  })
  
 
  
  router.post('/delete/:id',async(req,res)=>{
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
  })
  
  
  router.get('/teachers', async (req, res) => {
    try {
      const students = await Student.find({ type: 'client' ,isDeleted:false});
      res.json(students);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  router.get('/coursestudents/:id', async (req, res) => {
    const courseId = new mongoose.Types.ObjectId(req.params.id);
    try {
      const students = await Student.find({ type: 'student' ,isDeleted:false,course: { $elemMatch: { id:courseId } }});
      res.json(students);
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = router;