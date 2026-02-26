const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const User = require('../models/User');

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
router.use(limiter);

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST save a match
router.post('/:id/save-match', async (req, res) => {
  try {
    const { matchUserId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { savedMatches: matchUserId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ savedMatches: user.savedMatches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE unsave a match
router.delete('/:id/save-match/:matchUserId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { savedMatches: req.params.matchUserId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ savedMatches: user.savedMatches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET saved matches
router.get('/:id/saved-matches', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('savedMatches');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.savedMatches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
