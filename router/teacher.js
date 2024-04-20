const express = require('express');
const router = express.Router();
const Student = require('../models/Student');


router.get('/teachers', async (req, res) => {
    try {
      const students = await Student.find({ type: 'teacher' ,isDeleted:false});
      res.json(students);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  module.exports = router;