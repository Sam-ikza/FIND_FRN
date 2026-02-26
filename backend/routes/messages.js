const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const Message = require('../models/Message');

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
router.use(limiter);

// GET messages for a chat room
router.get('/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all conversations for a user
router.get('/conversations/:userId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.params.userId }, { receiver: req.params.userId }]
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: -1 });

    // Group by roomId
    const conversationMap = new Map();
    for (const msg of messages) {
      if (!conversationMap.has(msg.roomId)) {
        conversationMap.set(msg.roomId, msg);
      }
    }
    res.json(Array.from(conversationMap.values()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
