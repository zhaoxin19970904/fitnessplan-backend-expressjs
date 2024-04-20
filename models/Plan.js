const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  pid: String,
  age: Number,
  gender: String,
  weight: Number,
  goal: String,
  plan: String,
  createdAt: { type: Date, default: Date.now },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;