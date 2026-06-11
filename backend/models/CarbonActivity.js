const mongoose = require('mongoose');

const carbonActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['transport', 'energy', 'food', 'shopping', 'waste', 'other']
  },
  activityType: {
    type: String,
    required: [true, 'Please add an activity type']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  carbonValue: {
    type: Number,
    required: [true, 'Please add carbon value in kg CO2']
  },
  date: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Map,
    of: String
  },
  isPositive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

carbonActivitySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('CarbonActivity', carbonActivitySchema);