const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, position } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, role: role || 'employee', department, position });
    await user.save();
    res.json({ message: 'Registered' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
