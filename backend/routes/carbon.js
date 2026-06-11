const express = require('express');
const inMemoryDB = require('../config/memorydb');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/activities', protect, async (req, res) => {
  try {
    const { category, activityType, description, carbonValue, date, metadata, isPositive } = req.body;

    const activity = inMemoryDB.createActivity({
      user: req.user._id,
      category,
      activityType,
      description,
      carbonValue,
      date: date || new Date(),
      metadata,
      isPositive
    });

    if (isPositive) {
      const user = inMemoryDB.findUserById(req.user._id);
      inMemoryDB.updateUser(req.user._id, {
        totalCarbonSaved: (user.totalCarbonSaved || 0) + carbonValue,
        points: (user.points || 0) + Math.floor(carbonValue * 10)
      });
    } else {
      const user = inMemoryDB.findUserById(req.user._id);
      inMemoryDB.updateUser(req.user._id, {
        points: (user.points || 0) + Math.floor(carbonValue * 2)
      });
    }

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/activities', protect, async (req, res) => {
  try {
    const { startDate, endDate, category, limit } = req.query;
    const query = {};
    if (startDate) query.startDate = startDate;
    if (endDate) query.endDate = endDate;
    if (category) query.category = category;
    if (limit) query.limit = parseInt(limit);

    const activities = inMemoryDB.getActivities(req.user._id, query);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/activities/:id', protect, async (req, res) => {
  try {
    const deleted = inMemoryDB.deleteActivity(req.params.id, req.user._id);
    if (!deleted) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const { period } = req.query;
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const stats = inMemoryDB.getStats(req.user._id, startDate);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/calculate', protect, async (req, res) => {
  try {
    const { category, value, unit } = req.query;
    let carbonValue = 0;

    const emissionFactors = {
      transport: { car: 0.21, bus: 0.089, train: 0.041, flight: 0.255, bike: 0, walk: 0 },
      energy: { electricity: 0.5, naturalGas: 2.0, solar: 0.02, wind: 0.01 },
      food: { meat: 27.0, dairy: 3.2, vegetables: 0.4, grains: 0.8, processed: 1.5 },
      shopping: { clothing: 10.0, electronics: 50.0, furniture: 20.0, plastic: 6.0 }
    };

    if (emissionFactors[category] && emissionFactors[category][unit]) {
      carbonValue = parseFloat(value) * emissionFactors[category][unit];
    }

    res.json({ carbonValue: Math.round(carbonValue * 100) / 100 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;