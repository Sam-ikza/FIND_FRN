const router = require('express').Router();
const Room = require('../models/Room');

// GET all rooms with optional filters
router.get('/', async (req, res) => {
  try {
    const { city, minRent, maxRent, vacancyType, amenities, sort, search } = req.query;
    const filter = {};

    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (vacancyType) filter.vacancyType = vacancyType;
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }
    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim()).filter(Boolean);
      if (amenityList.length) filter.amenities = { $all: amenityList };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'cheapest') sortObj = { rent: 1 };
    else if (sort === 'expensive') sortObj = { rent: -1 };

    const rooms = await Room.find(filter)
      .populate('currentRoommates', 'name age occupation')
      .populate('postedBy', 'name')
      .sort(sortObj);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET rooms for map (returns rooms with lat/lng)
router.get('/map', async (req, res) => {
  try {
    const rooms = await Room.find({ 
      'location.lat': { $ne: 0 }, 
      'location.lng': { $ne: 0 } 
    }).select('title rent location vacancyType _id').lean();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('currentRoommates')
      .populate('postedBy', 'name');
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create room
router.post('/', async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update room
router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE room
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
