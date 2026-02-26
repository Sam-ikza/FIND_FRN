const router = require('express').Router();
const User = require('../models/User');
const Room = require('../models/Room');
const { computeMatchScore } = require('../services/matching');

// POST /api/recommendations/:userId
router.post('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Find top 3 rooms based on location + budget
    const rooms = await Room.find().populate('currentRoommates');
    const scoredRooms = rooms
      .map(room => {
        let score = 0;
        // Location match
        if (room.location?.city?.toLowerCase() === user.location?.city?.toLowerCase()) score += 40;
        else if (room.location?.state?.toLowerCase() === user.location?.state?.toLowerCase()) score += 20;
        // Budget match
        const rent = room.rent || 0;
        if (rent >= (user.budgetRange?.min || 0) && rent <= (user.budgetRange?.max || 99999)) score += 40;
        else if (rent <= (user.budgetRange?.max || 99999) * 1.1) score += 20;
        // Lifestyle compatibility with existing roommates
        if (room.currentRoommates && room.currentRoommates.length > 0) {
          const roommateScores = room.currentRoommates
            .filter(rm => rm._id && rm._id.toString() !== user._id.toString())
            .map(rm => computeMatchScore(user, rm).finalScore);
          if (roommateScores.length > 0) {
            const avgRoommateScore = roommateScores.reduce((a, b) => a + b, 0) / roommateScores.length;
            score += (avgRoommateScore / 100) * 20;
          }
        }
        return { room: { _id: room._id, title: room.title, rent: room.rent, location: room.location, vacancyType: room.vacancyType, amenities: room.amenities }, score: Math.round(score) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // "Users like you also matched with..." — find top user matches and get their top matches
    const allUsers = await User.find({ _id: { $ne: user._id } });
    const topMatches = allUsers
      .map(u => ({ user: u, score: computeMatchScore(user, u).finalScore }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const suggestedUsers = topMatches.map(m => ({
      _id: m.user._id,
      name: m.user.name,
      age: m.user.age,
      occupation: m.user.occupation,
      location: m.user.location,
      matchScore: m.score
    }));

    res.json({
      recommendedRooms: scoredRooms,
      usersLikeYouAlsoMatched: suggestedUsers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
