const express = require('express');
const inMemoryDB = require('../config/memorydb');
const { protect } = require('../middleware/auth');

const router = express.Router();

const badges = [
  { name: 'First Steps', description: 'Log your first activity', icon: '🌱', requirement: 1 },
  { name: 'Eco Warrior', description: 'Save 100kg CO2', icon: '🛡️', requirement: 100 },
  { name: 'Carbon Cutter', description: 'Log 10 activities', icon: '✂️', requirement: 10 },
  { name: 'Green Guardian', description: 'Save 500kg CO2', icon: '🌿', requirement: 500 },
  { name: 'Planet Protector', description: 'Save 1000kg CO2', icon: '🌍', requirement: 1000 },
  { name: 'Streak Master', description: '7-day login streak', icon: '🔥', requirement: 7 },
  { name: 'Challenge Champion', description: 'Complete 5 challenges', icon: '🏆', requirement: 5 },
  { name: 'Sustainability Star', description: 'Reach Level 10', icon: '⭐', requirement: 10 }
];

const challenges = [
  { id: 'meatless-week', title: 'Meatless Week', description: 'Go vegetarian for 7 days', carbonReduction: 50, duration: 7 },
  { id: 'bike-to-work', title: 'Bike to Work', description: 'Cycle instead of driving for 5 days', carbonReduction: 30, duration: 5 },
  { id: 'zero-waste', title: 'Zero Waste Day', description: 'Produce no landfill waste for a day', carbonReduction: 5, duration: 1 },
  { id: 'energy-saver', title: 'Energy Saver', description: 'Reduce electricity usage by 20%', carbonReduction: 20, duration: 7 },
  { id: 'public-transit', title: 'Public Transit Hero', description: 'Use public transport for all trips', carbonReduction: 40, duration: 5 }
];

router.get('/badges', protect, async (req, res) => {
  try {
    const user = inMemoryDB.findUserById(req.user._id);
    const earnedBadges = (user.badges || []).map(b => b.name);
    
    const availableBadges = badges.map(badge => ({
      ...badge,
      earned: earnedBadges.includes(badge.name)
    }));

    res.json(availableBadges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/challenges', protect, async (req, res) => {
  try {
    const user = inMemoryDB.findUserById(req.user._id);
    const userChallenges = user.challenges || [];

    const availableChallenges = challenges.map(challenge => {
      const userChallenge = userChallenges.find(uc => uc.challengeId === challenge.id);
      return {
        ...challenge,
        progress: userChallenge ? userChallenge.progress : 0,
        completed: userChallenge ? userChallenge.completed : false,
        enrolled: !!userChallenge
      };
    });

    res.json(availableChallenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/challenges/:challengeId/enroll', protect, async (req, res) => {
  try {
    const user = inMemoryDB.findUserById(req.user._id);
    const challenge = challenges.find(c => c.id === req.params.challengeId);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const existingChallenge = (user.challenges || []).find(c => c.challengeId === challenge.id);
    if (existingChallenge) {
      return res.status(400).json({ message: 'Already enrolled in this challenge' });
    }

    const newChallenges = [...(user.challenges || []), {
      challengeId: challenge.id,
      title: challenge.title,
      progress: 0,
      completed: false,
      deadline: new Date(Date.now() + challenge.duration * 24 * 60 * 60 * 1000)
    }];

    inMemoryDB.updateUser(req.user._id, { challenges: newChallenges });
    res.json({ message: 'Enrolled in challenge successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/challenges/:challengeId/progress', protect, async (req, res) => {
  try {
    const user = inMemoryDB.findUserById(req.user._id);
    const challengeIndex = (user.challenges || []).findIndex(c => c.challengeId === req.params.challengeId);

    if (challengeIndex === -1) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const { progress } = req.body;
    const updatedChallenges = [...user.challenges];
    updatedChallenges[challengeIndex].progress = progress;

    if (progress >= 100) {
      updatedChallenges[challengeIndex].completed = true;
      const challenge = challenges.find(c => c.id === req.params.challengeId);
      if (challenge) {
        inMemoryDB.updateUser(req.user._id, {
          challenges: updatedChallenges,
          totalCarbonSaved: (user.totalCarbonSaved || 0) + challenge.carbonReduction,
          points: (user.points || 0) + challenge.carbonReduction * 10
        });
        return res.json(updatedChallenges[challengeIndex]);
      }
    }

    inMemoryDB.updateUser(req.user._id, { challenges: updatedChallenges });
    res.json(updatedChallenges[challengeIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/goals', protect, async (req, res) => {
  try {
    const user = inMemoryDB.findUserById(req.user._id);
    res.json(user.goals || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/goals', protect, async (req, res) => {
  try {
    const user = inMemoryDB.findUserById(req.user._id);
    const { title, target } = req.body;

    const newGoal = {
      _id: Date.now().toString(),
      title,
      target,
      current: 0,
      completed: false,
      createdAt: new Date()
    };

    const updatedGoals = [...(user.goals || []), newGoal];
    inMemoryDB.updateUser(req.user._id, { goals: updatedGoals });
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/goals/:goalId', protect, async (req, res) => {
  try {
    const user = inMemoryDB.findUserById(req.user._id);
    const goalIndex = (user.goals || []).findIndex(g => g._id.toString() === req.params.goalId);

    if (goalIndex === -1) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const { current } = req.body;
    const updatedGoals = [...user.goals];
    updatedGoals[goalIndex].current = current;

    if (current >= updatedGoals[goalIndex].target) {
      updatedGoals[goalIndex].completed = true;
      inMemoryDB.updateUser(req.user._id, {
        goals: updatedGoals,
        points: (user.points || 0) + 100
      });
    } else {
      inMemoryDB.updateUser(req.user._id, { goals: updatedGoals });
    }

    res.json(updatedGoals[goalIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/leaderboard', protect, async (req, res) => {
  try {
    const leaderboard = inMemoryDB.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/level', protect, async (req, res) => {
  try {
    const user = inMemoryDB.findUserById(req.user._id);
    const pointsToNextLevel = (user.level || 1) * 1000;
    const progress = ((user.points || 0) / pointsToNextLevel) * 100;

    res.json({
      level: user.level || 1,
      points: user.points || 0,
      pointsToNextLevel,
      progress: Math.min(progress, 100)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;