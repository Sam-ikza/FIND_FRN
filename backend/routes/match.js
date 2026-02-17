const router = require('express').Router();
const User = require('../models/User');
const Room = require('../models/Room');
const { findMatches } = require('../services/matching');

// POST /api/match — Find matches for a user
router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const seeker = await User.findById(userId);
    if (!seeker) return res.status(404).json({ error: 'User not found' });

    const allUsers = await User.find({ _id: { $ne: userId } });
    const allRooms = await Room.find().populate('currentRoommates');

    const matches = findMatches(seeker, allUsers, allRooms);

    res.json({
      seeker: { _id: seeker._id, name: seeker.name },
      totalMatches: matches.length,
      matches
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
