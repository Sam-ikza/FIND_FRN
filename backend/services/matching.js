const explanation = require('./explanation');

/**
 * Core matching engine.
 * Optimizes for INTENT ALIGNMENT — not just similarity.
 */

function computeMatchScore(seeker, candidate) {
  const breakdown = {};
  let totalScore = 0;
  let totalWeight = 0;

  // ── 1. LIFE INTENT ALIGNMENT (weight: 30) ──
  const intentWeight = 30;
  let intentScore = 0;

  // lifeMode alignment
  const seekerMode = seeker.lifeIntent?.lifeMode || 'balanced';
  const candidateMode = candidate.lifeIntent?.lifeMode || 'balanced';

  if (seekerMode === candidateMode) {
    intentScore += 40;
  } else if (seekerMode === 'balanced' || candidateMode === 'balanced') {
    intentScore += 25;
  } else {
    // growth vs chill = high friction
    intentScore += 5;
  }

  // struggleStabilityScale alignment (closer = better)
  const seekerSS = seeker.lifeIntent?.struggleStabilityScale || 3;
  const candidateSS = candidate.lifeIntent?.struggleStabilityScale || 3;
  const ssDiff = Math.abs(seekerSS - candidateSS);
  intentScore += Math.max(0, 30 - ssDiff * 8);

  // shared life goals
  const seekerGoals = seeker.lifeIntent?.lifeGoals || [];
  const candidateGoals = candidate.lifeIntent?.lifeGoals || [];
  const sharedGoals = seekerGoals.filter(g => candidateGoals.includes(g));
  intentScore += Math.min(sharedGoals.length * 10, 30);

  breakdown.intentAlignment = {
    score: Math.round(intentScore),
    max: 100,
    details: { seekerMode, candidateMode, ssDiff, sharedGoals }
  };
  totalScore += (intentScore / 100) * intentWeight;
  totalWeight += intentWeight;

  // ── 2. LIFESTYLE COMPATIBILITY (weight: 25) ──
  const lifestyleWeight = 25;
  let lifestyleScore = 0;

  // Cleanliness (closer = better)
  const cleanDiff = Math.abs(
    (seeker.cleanlinessLevel || 3) - (candidate.cleanlinessLevel || 3)
  );
  lifestyleScore += Math.max(0, 25 - cleanDiff * 7);

  // Sleep schedule
  const seekerSleep = seeker.sleepSchedule || 'flexible';
  const candidateSleep = candidate.sleepSchedule || 'flexible';
  if (seekerSleep === candidateSleep) lifestyleScore += 20;
  else if (seekerSleep === 'flexible' || candidateSleep === 'flexible') lifestyleScore += 12;
  else lifestyleScore += 2;

  // Smoking / Drinking dealbreaker check
  if (seeker.smoking !== candidate.smoking) lifestyleScore -= 5;
  else lifestyleScore += 15;

  if (seeker.drinking !== candidate.drinking) lifestyleScore -= 2;
  else lifestyleScore += 10;

  // Noise tolerance alignment
  const noiseMap = { low: 1, medium: 2, high: 3 };
  const noiseDiff = Math.abs(
    (noiseMap[seeker.noiseTolerance] || 2) - (noiseMap[candidate.noiseTolerance] || 2)
  );
  lifestyleScore += Math.max(0, 15 - noiseDiff * 7);

  // Guests frequency
  const guestMap = { low: 1, medium: 2, high: 3 };
  const guestDiff = Math.abs(
    (guestMap[seeker.guestsFrequency] || 2) - (guestMap[candidate.guestsFrequency] || 2)
  );
  lifestyleScore += Math.max(0, 15 - guestDiff * 7);

  lifestyleScore = Math.max(0, Math.min(100, lifestyleScore));
  breakdown.lifestyleCompatibility = {
    score: Math.round(lifestyleScore),
    max: 100,
    details: { cleanDiff, sleepMatch: seekerSleep === candidateSleep, noiseDiff, guestDiff }
  };
  totalScore += (lifestyleScore / 100) * lifestyleWeight;
  totalWeight += lifestyleWeight;

  // ── 3. PERSONALITY FIT (weight: 15) ──
  const personalityWeight = 15;
  let personalityScore = 0;

  // introvert/extrovert: some difference is OK, extremes clash
  const ieDiff = Math.abs(
    (seeker.introvertExtrovertScale || 3) - (candidate.introvertExtrovertScale || 3)
  );
  personalityScore += Math.max(0, 50 - ieDiff * 12);

  // Weekend style
  const seekerWknd = seeker.weekendStyle || 'mixed';
  const candidateWknd = candidate.weekendStyle || 'mixed';
  if (seekerWknd === candidateWknd) personalityScore += 30;
  else if (seekerWknd === 'mixed' || candidateWknd === 'mixed') personalityScore += 20;
  else personalityScore += 5;

  // Shared hobbies bonus
  const seekerHobbies = (seeker.hobbies || []).map(h => h.toLowerCase());
  const candidateHobbies = (candidate.hobbies || []).map(h => h.toLowerCase());
  const sharedHobbies = seekerHobbies.filter(h => candidateHobbies.includes(h));
  personalityScore += Math.min(sharedHobbies.length * 7, 20);

  personalityScore = Math.min(100, personalityScore);
  breakdown.personalityFit = {
    score: Math.round(personalityScore),
    max: 100,
    details: { ieDiff, weekendMatch: seekerWknd === candidateWknd, sharedHobbies }
  };
  totalScore += (personalityScore / 100) * personalityWeight;
  totalWeight += personalityWeight;

  // ── 4. BUDGET OVERLAP (weight: 15) ──
  const budgetWeight = 15;
  let budgetScore = 0;

  const sMin = seeker.budgetRange?.min || 0;
  const sMax = seeker.budgetRange?.max || 99999;
  const cMin = candidate.budgetRange?.min || 0;
  const cMax = candidate.budgetRange?.max || 99999;

  const overlapStart = Math.max(sMin, cMin);
  const overlapEnd = Math.min(sMax, cMax);
  if (overlapEnd >= overlapStart) {
    const overlapRange = overlapEnd - overlapStart;
    const seekerRange = sMax - sMin || 1;
    budgetScore = Math.min(100, Math.round((overlapRange / seekerRange) * 100));
  }

  breakdown.budgetOverlap = { score: budgetScore, max: 100 };
  totalScore += (budgetScore / 100) * budgetWeight;
  totalWeight += budgetWeight;

  // ── 5. LOCATION MATCH (weight: 10) ──
  const locationWeight = 10;
  let locationScore = 0;

  if (seeker.location?.city?.toLowerCase() === candidate.location?.city?.toLowerCase()) {
    locationScore = 100;
  } else if (seeker.location?.state?.toLowerCase() === candidate.location?.state?.toLowerCase()) {
    locationScore = 60;
  } else {
    locationScore = 20;
  }

  breakdown.locationMatch = { score: locationScore, max: 100 };
  totalScore += (locationScore / 100) * locationWeight;
  totalWeight += locationWeight;

  // ── 6. CULTURAL OPENNESS (weight: 5) ──
  const culturalWeight = 5;
  let culturalScore = 50; // neutral default

  const seekerCultural = seeker.culturalOpenness?.culturalPreference || 'mixed';
  const candidateCultural = candidate.culturalOpenness?.culturalPreference || 'mixed';
  const seekerStatePref = seeker.culturalOpenness?.sameStatePreference || 'open_to_all';

  const sameState = seeker.location?.state?.toLowerCase() === candidate.location?.state?.toLowerCase();

  if (seekerStatePref === 'same_state_only' && !sameState) {
    culturalScore = 10;
  } else if (seekerCultural === 'explorer' || candidateCultural === 'explorer') {
    culturalScore = 85;
  } else if (seekerCultural === candidateCultural) {
    culturalScore = 80;
  } else {
    culturalScore = 50;
  }

  breakdown.culturalOpenness = { score: culturalScore, max: 100, details: { seekerCultural, candidateCultural, sameState } };
  totalScore += (culturalScore / 100) * culturalWeight;
  totalWeight += culturalWeight;

  // ── FINAL ──
  const finalScore = Math.round((totalScore / totalWeight) * 100);

  return { finalScore, breakdown };
}

/**
 * Predict conflicts between two users.
 */
function predictConflicts(seeker, candidate) {
  const conflicts = [];

  // Life mode clash
  const seekerMode = seeker.lifeIntent?.lifeMode || 'balanced';
  const candidateMode = candidate.lifeIntent?.lifeMode || 'balanced';
  if (
    (seekerMode === 'growth' && candidateMode === 'chill') ||
    (seekerMode === 'chill' && candidateMode === 'growth')
  ) {
    conflicts.push({
      type: 'life_mode_clash',
      severity: 'high',
      message: `${seeker.name} is in "${seekerMode}" mode while ${candidate.name} is in "${candidateMode}" mode. This can cause daily friction — one wants hustle, the other wants peace.`
    });
  }

  // Struggle vs stability
  const ssDiff = Math.abs(
    (seeker.lifeIntent?.struggleStabilityScale || 3) - (candidate.lifeIntent?.struggleStabilityScale || 3)
  );
  if (ssDiff >= 3) {
    conflicts.push({
      type: 'struggle_stability_gap',
      severity: 'high',
      message: `Big gap in comfort with uncertainty. One thrives in chaos, the other needs predictability. Expect tension around financial risks, schedules, and lifestyle changes.`
    });
  } else if (ssDiff === 2) {
    conflicts.push({
      type: 'struggle_stability_gap',
      severity: 'medium',
      message: `Moderate difference on the struggle-stability spectrum. Manageable, but requires communication about expectations.`
    });
  }

  // Sleep schedule conflict
  if (
    (seeker.sleepSchedule === 'early' && candidate.sleepSchedule === 'late') ||
    (seeker.sleepSchedule === 'late' && candidate.sleepSchedule === 'early')
  ) {
    conflicts.push({
      type: 'sleep_schedule',
      severity: 'medium',
      message: `Opposite sleep schedules. Morning person vs. night owl — expect noise/light disturbances.`
    });
  }

  // Cleanliness gap
  const cleanDiff = Math.abs(
    (seeker.cleanlinessLevel || 3) - (candidate.cleanlinessLevel || 3)
  );
  if (cleanDiff >= 3) {
    conflicts.push({
      type: 'cleanliness_gap',
      severity: 'high',
      message: `Very different cleanliness standards. This is one of the top reasons roommates fight.`
    });
  } else if (cleanDiff === 2) {
    conflicts.push({
      type: 'cleanliness_gap',
      severity: 'medium',
      message: `Noticeable difference in cleanliness expectations. Set clear rules early.`
    });
  }

  // Smoking dealbreaker
  if (seeker.smoking !== candidate.smoking) {
    conflicts.push({
      type: 'smoking',
      severity: seeker.smoking ? 'medium' : 'high',
      message: seeker.smoking
        ? `You smoke but your potential roommate doesn't — they may be uncomfortable.`
        : `Your potential roommate smokes. If you're sensitive to smoke, this is a dealbreaker.`
    });
  }

  // Noise vs guests clash
  const noiseMap = { low: 1, medium: 2, high: 3 };
  const guestMap = { low: 1, medium: 2, high: 3 };

  if (
    (noiseMap[seeker.noiseTolerance] || 2) === 1 &&
    (guestMap[candidate.guestsFrequency] || 2) === 3
  ) {
    conflicts.push({
      type: 'noise_guests_clash',
      severity: 'high',
      message: `You prefer quiet, but your match has guests over frequently. Expect noise conflicts.`
    });
  }

  // Introvert-Extrovert extreme clash
  const ieDiff = Math.abs(
    (seeker.introvertExtrovertScale || 3) - (candidate.introvertExtrovertScale || 3)
  );
  if (ieDiff >= 3) {
    conflicts.push({
      type: 'social_energy',
      severity: 'medium',
      message: `Very different social energy levels. One needs lots of alone time, the other craves social interaction at home.`
    });
  }

  // Energy level mismatch
  const energyMap = { low: 1, medium: 2, high: 3 };
  const energyDiff = Math.abs(
    (energyMap[seeker.lifeIntent?.dailyEnergyLevel] || 2) -
    (energyMap[candidate.lifeIntent?.dailyEnergyLevel] || 2)
  );
  if (energyDiff >= 2) {
    conflicts.push({
      type: 'energy_mismatch',
      severity: 'low',
      message: `Different daily energy levels. Might cause minor friction in shared routines.`
    });
  }

  return conflicts;
}

/**
 * Find matches for a user from a list of candidates.
 */
function findMatches(seeker, candidates, rooms = []) {
  const results = candidates
    .filter(c => c._id.toString() !== seeker._id.toString())
    .map(candidate => {
      const { finalScore, breakdown } = computeMatchScore(seeker, candidate);
      const conflicts = predictConflicts(seeker, candidate);
      const explanations = explanation.generateExplanations(seeker, candidate, breakdown, conflicts);

      // Find rooms where this candidate is a current roommate
      const linkedRooms = rooms.filter(r =>
        r.currentRoommates.some(rm =>
          (rm._id || rm).toString() === candidate._id.toString()
        )
      );

      return {
        candidate: {
          _id: candidate._id,
          name: candidate.name,
          age: candidate.age,
          gender: candidate.gender,
          occupation: candidate.occupation,
          location: candidate.location,
          lifeIntent: candidate.lifeIntent,
          hobbies: candidate.hobbies
        },
        matchScore: finalScore,
        breakdown,
        conflicts,
        explanations,
        linkedRooms: linkedRooms.map(r => ({
          _id: r._id,
          title: r.title,
          rent: r.rent,
          location: r.location,
          vacancyType: r.vacancyType
        }))
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return results;
}

module.exports = { computeMatchScore, predictConflicts, findMatches };
