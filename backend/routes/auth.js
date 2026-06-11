const express = require('express');
const jwt = require('jsonwebtoken');
const inMemoryDB = require('../config/memorydb');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'demo_secret_key', { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = inMemoryDB.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await inMemoryDB.createUser({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = inMemoryDB.findUserByEmail(email);

    if (user && (await inMemoryDB.matchPassword(password, user.password))) {
      inMemoryDB.updateUser(user._id, { lastLoginDate: new Date() });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  const { password, ...userWithoutPassword } = req.user.toObject ? req.user.toObject() : req.user;
  res.json(userWithoutPassword);
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = inMemoryDB.findUserById(req.user._id);
    if (user) {
      const updates = {};
      if (req.body.name) updates.name = req.body.name;
      const updatedUser = inMemoryDB.updateUser(req.user._id, updates);
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;