const express = require('express');
const Plan = require('../models/Plan');

const router = express.Router();


router.get('/personplan/:id', async (req, res) => {
  const userId = req.params.id; 

  try {
    const plans = await Plan.find({ pid: userId,isDeleted:false }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/plandetails/:id',async (req,res)=>{
    const planId = req.params.id;
    try{
        const plans = await Plan.findOne({_id: planId});
        console.log(plans)
        res.json(plans);
    } catch (err){
        console.err(err);

        res.status(500).send('Can not find')
    }
})

router.post('/delete/:id', async (req, res) => {
    try {
        const planId = req.params.id;
    
        const result = await Plan.findByIdAndUpdate(planId, { isDeleted: true });
    
    
        if (!result) {
          return res.status(404).json({ message: 'plan not found' });
        }
    
        res.json({ message: "plan deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting plan" });
      }
});

module.exports = router;