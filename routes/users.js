const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get list of users (manager/admin)
router.get('/', auth(['manager','admin']), async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

// Get current user profile
router.get('/me', auth(), async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
});

// Admin only: delete user
router.delete('/:id', auth(['admin']), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
