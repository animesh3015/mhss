const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

// Middleware for JWT Authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Get Messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().populate('user', 'username');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post Message
router.post('/', authenticate, async (req, res) => {
  try {
    const message = new Message({
      user: req.userId,
      content: req.body.content,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
