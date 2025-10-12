const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create a review (reviewer is req.user)
router.post('/', auth(), async (req, res) => {
  try {
    const payload = req.body;
    payload.reviewer = req.user.id;
    const review = new Review(payload);
    await review.save();
    res.json(review);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update review (only reviewer or admin/manager)
router.put('/:id', auth(), async (req, res) => {
  const r = await Review.findById(req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  const allowed = (r.reviewer.toString() === req.user.id) || ['manager','admin'].includes(req.user.role);
  if (!allowed) return res.status(403).json({ message: 'Forbidden' });
  Object.assign(r, req.body);
  await r.save();
  res.json(r);
});

// Get reviews for an employee (employee themselves or manager/admin)
router.get('/employee/:employeeId', auth(), async (req, res) => {
  const { employeeId } = req.params;
  if (req.user.id !== employeeId && !['manager','admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const reviews = await Review.find({ employee: employeeId }).populate('reviewer', 'name email role');
  res.json(reviews);
});

// Manager/admin: list all reviews with populate
router.get('/', auth(['manager','admin']), async (req, res) => {
  const reviews = await Review.find().populate('employee','name email department').populate('reviewer','name email role');
  res.json(reviews);
});

// Get single review (reviewer, employee when allowed, or manager/admin)
router.get('/:id', auth(), async (req, res) => {
  const r = await Review.findById(req.params.id).populate('employee reviewer','name email role');
  if (!r) return res.status(404).json({ message: 'Not found' });
  const allowed = (r.reviewer._id.toString() === req.user.id) || (r.employee._id.toString() === req.user.id) || ['manager','admin'].includes(req.user.role);
  if (!allowed) return res.status(403).json({ message: 'Forbidden' });
  res.json(r);
});

module.exports = router;
