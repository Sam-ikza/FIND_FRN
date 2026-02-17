const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'non-binary', 'other'], required: true },
  occupation: { type: String, enum: ['student', 'working', 'remote'], required: true },
  budgetRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  moveInDate: { type: Date },

  // Lifestyle
  cleanlinessLevel: { type: Number, min: 1, max: 5, default: 3 },
  sleepSchedule: { type: String, enum: ['early', 'late', 'flexible'], default: 'flexible' },
  smoking: { type: Boolean, default: false },
  drinking: { type: Boolean, default: false },
  guestsFrequency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  noiseTolerance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },

  // Personality
  introvertExtrovertScale: { type: Number, min: 1, max: 5, default: 3 },
  weekendStyle: { type: String, enum: ['homebody', 'outings', 'mixed'], default: 'mixed' },

  // Hobbies
  hobbies: [{ type: String }],

  // Life Intent
  lifeIntent: {
    lifeMode: { type: String, enum: ['growth', 'chill', 'balanced'], default: 'balanced' },
    lifeGoals: [{
      type: String,
      enum: [
        'career_growth', 'higher_studies', 'startup_or_side_hustle',
        'fitness', 'creative_exploration', 'spiritual_growth', 'stability_and_peace'
      ]
    }],
    dailyEnergyLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    struggleStabilityScale: { type: Number, min: 1, max: 5, default: 3 }
  },

  // Cultural Openness
  culturalOpenness: {
    culturalPreference: {
      type: String,
      enum: ['comfort_zone', 'mixed', 'explorer'],
      default: 'mixed'
    },
    sameStatePreference: {
      type: String,
      enum: ['same_state_only', 'open_to_all'],
      default: 'open_to_all'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
