const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rent: { type: Number, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  vacancyType: { type: String, enum: ['single', 'shared'], required: true },
  availableFrom: { type: Date, required: true },
  currentRoommates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, default: '' }
}, { timestamps: true });

// Indexes for frequently queried fields
roomSchema.index({ 'location.city': 1 });
roomSchema.index({ rent: 1 });
roomSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Room', roomSchema);
