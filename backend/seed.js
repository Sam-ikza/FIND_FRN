const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roommate_platform';

const users = [
  {
    name: 'Aarav Sharma',
    age: 24,
    gender: 'male',
    occupation: 'working',
    budgetRange: { min: 8000, max: 15000 },
    location: { city: 'Bengaluru', state: 'Karnataka' },
    moveInDate: new Date('2026-03-01'),
    cleanlinessLevel: 4,
    sleepSchedule: 'late',
    smoking: false,
    drinking: true,
    guestsFrequency: 'medium',
    noiseTolerance: 'medium',
    introvertExtrovertScale: 4,
    weekendStyle: 'outings',
    hobbies: ['coding', 'gaming', 'music'],
    lifeIntent: {
      lifeMode: 'growth',
      lifeGoals: ['career_growth', 'startup_or_side_hustle'],
      dailyEnergyLevel: 'high',
      struggleStabilityScale: 2
    },
    culturalOpenness: {
      culturalPreference: 'explorer',
      sameStatePreference: 'open_to_all'
    }
  },
  {
    name: 'Priya Nair',
    age: 22,
    gender: 'female',
    occupation: 'student',
    budgetRange: { min: 5000, max: 10000 },
    location: { city: 'Bengaluru', state: 'Karnataka' },
    moveInDate: new Date('2026-03-15'),
    cleanlinessLevel: 5,
    sleepSchedule: 'early',
    smoking: false,
    drinking: false,
    guestsFrequency: 'low',
    noiseTolerance: 'low',
    introvertExtrovertScale: 2,
    weekendStyle: 'homebody',
    hobbies: ['reading', 'yoga', 'cooking'],
    lifeIntent: {
      lifeMode: 'chill',
      lifeGoals: ['higher_studies', 'spiritual_growth', 'stability_and_peace'],
      dailyEnergyLevel: 'medium',
      struggleStabilityScale: 5
    },
    culturalOpenness: {
      culturalPreference: 'comfort_zone',
      sameStatePreference: 'same_state_only'
    }
  },
  {
    name: 'Rohit Patel',
    age: 26,
    gender: 'male',
    occupation: 'remote',
    budgetRange: { min: 10000, max: 18000 },
    location: { city: 'Bengaluru', state: 'Karnataka' },
    moveInDate: new Date('2026-04-01'),
    cleanlinessLevel: 3,
    sleepSchedule: 'flexible',
    smoking: false,
    drinking: true,
    guestsFrequency: 'medium',
    noiseTolerance: 'medium',
    introvertExtrovertScale: 3,
    weekendStyle: 'mixed',
    hobbies: ['coding', 'cycling', 'photography'],
    lifeIntent: {
      lifeMode: 'balanced',
      lifeGoals: ['career_growth', 'fitness'],
      dailyEnergyLevel: 'high',
      struggleStabilityScale: 3
    },
    culturalOpenness: {
      culturalPreference: 'mixed',
      sameStatePreference: 'open_to_all'
    }
  },
  {
    name: 'Sneha Iyer',
    age: 23,
    gender: 'female',
    occupation: 'working',
    budgetRange: { min: 7000, max: 12000 },
    location: { city: 'Bengaluru', state: 'Karnataka' },
    moveInDate: new Date('2026-03-01'),
    cleanlinessLevel: 4,
    sleepSchedule: 'late',
    smoking: false,
    drinking: false,
    guestsFrequency: 'low',
    noiseTolerance: 'low',
    introvertExtrovertScale: 2,
    weekendStyle: 'homebody',
    hobbies: ['reading', 'music', 'painting'],
    lifeIntent: {
      lifeMode: 'growth',
      lifeGoals: ['career_growth', 'creative_exploration'],
      dailyEnergyLevel: 'medium',
      struggleStabilityScale: 2
    },
    culturalOpenness: {
      culturalPreference: 'explorer',
      sameStatePreference: 'open_to_all'
    }
  },
  {
    name: 'Vikram Singh',
    age: 28,
    gender: 'male',
    occupation: 'working',
    budgetRange: { min: 12000, max: 20000 },
    location: { city: 'Mumbai', state: 'Maharashtra' },
    moveInDate: new Date('2026-03-01'),
    cleanlinessLevel: 2,
    sleepSchedule: 'late',
    smoking: true,
    drinking: true,
    guestsFrequency: 'high',
    noiseTolerance: 'high',
    introvertExtrovertScale: 5,
    weekendStyle: 'outings',
    hobbies: ['gaming', 'partying', 'cricket'],
    lifeIntent: {
      lifeMode: 'growth',
      lifeGoals: ['startup_or_side_hustle', 'career_growth'],
      dailyEnergyLevel: 'high',
      struggleStabilityScale: 1
    },
    culturalOpenness: {
      culturalPreference: 'explorer',
      sameStatePreference: 'open_to_all'
    }
  },
  {
    name: 'Ananya Das',
    age: 25,
    gender: 'female',
    occupation: 'remote',
    budgetRange: { min: 8000, max: 14000 },
    location: { city: 'Pune', state: 'Maharashtra' },
    moveInDate: new Date('2026-04-01'),
    cleanlinessLevel: 4,
    sleepSchedule: 'flexible',
    smoking: false,
    drinking: false,
    guestsFrequency: 'medium',
    noiseTolerance: 'medium',
    introvertExtrovertScale: 3,
    weekendStyle: 'mixed',
    hobbies: ['writing', 'yoga', 'cooking', 'music'],
    lifeIntent: {
      lifeMode: 'balanced',
      lifeGoals: ['creative_exploration', 'stability_and_peace', 'fitness'],
      dailyEnergyLevel: 'medium',
      struggleStabilityScale: 4
    },
    culturalOpenness: {
      culturalPreference: 'mixed',
      sameStatePreference: 'open_to_all'
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Room.deleteMany({});
    console.log('Cleared existing data');

    const createdUsers = await User.insertMany(users);
    console.log(`Seeded ${createdUsers.length} users`);

    const rooms = [
      {
        title: 'Sunny 2BHK near Koramangala',
        rent: 12000,
        location: { city: 'Bengaluru', state: 'Karnataka' },
        amenities: ['WiFi', 'AC', 'Washing Machine', 'Kitchen'],
        images: [],
        vacancyType: 'shared',
        availableFrom: new Date('2026-03-01'),
        currentRoommates: [createdUsers[0]._id],
        postedBy: createdUsers[0]._id,
        description: 'Spacious room in a 2BHK apartment. Close to tech parks and cafes.'
      },
      {
        title: 'Quiet PG near Indiranagar',
        rent: 8000,
        location: { city: 'Bengaluru', state: 'Karnataka' },
        amenities: ['WiFi', 'Meals', 'Laundry'],
        images: [],
        vacancyType: 'single',
        availableFrom: new Date('2026-03-15'),
        currentRoommates: [createdUsers[1]._id],
        postedBy: createdUsers[1]._id,
        description: 'Peaceful PG for students. No smoking, quiet hours enforced.'
      },
      {
        title: 'Modern flat in Whitefield',
        rent: 15000,
        location: { city: 'Bengaluru', state: 'Karnataka' },
        amenities: ['WiFi', 'AC', 'Gym', 'Pool', 'Kitchen'],
        images: [],
        vacancyType: 'shared',
        availableFrom: new Date('2026-04-01'),
        currentRoommates: [createdUsers[2]._id],
        postedBy: createdUsers[2]._id,
        description: 'Fully furnished flat in a gated community. Great for remote workers.'
      },
      {
        title: 'Cozy room in Andheri West',
        rent: 14000,
        location: { city: 'Mumbai', state: 'Maharashtra' },
        amenities: ['WiFi', 'AC', 'Kitchen'],
        images: [],
        vacancyType: 'shared',
        availableFrom: new Date('2026-03-01'),
        currentRoommates: [createdUsers[4]._id],
        postedBy: createdUsers[4]._id,
        description: 'Well-connected area. Walking distance to metro.'
      }
    ];

    const createdRooms = await Room.insertMany(rooms);
    console.log(`Seeded ${createdRooms.length} rooms`);

    console.log('\n--- SEED COMPLETE ---');
    console.log('User IDs (use these for testing):');
    createdUsers.forEach(u => console.log(`  ${u.name}: ${u._id}`));

    await mongoose.connection.close();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
