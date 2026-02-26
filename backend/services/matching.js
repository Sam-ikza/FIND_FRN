const explanation = require('./explanation');

/**
 * Core matching engine.
 * Optimizes for INTENT ALIGNMENT — not just similarity.
 * Enhanced with dealbreakers, social compatibility, hobby categories, timing, and tier system.
 */

// Hobby category groups
const HOBBY_CATEGORIES = {
  active: ['gaming', 'cricket', 'cycling', 'football', 'badminton', 'gym', 'running', 'swimming', 'hiking', 'sports'],
  creative: ['painting', 'music', 'writing', 'photography', 'drawing', 'crafts', 'dance', 'singing'],
  social: ['partying', 'cooking', 'travel', 'shopping', 'movies', 'dining'],
  mindful: ['yoga', 'reading', 'meditation', 'gardening', 'journaling']
};

function getHobbyCategory(hobby) {
  const h = hobby.toLowerCase();
  for (const [category, hobbies] of Object.entries(HOBBY_CATEGORIES)) {
    if (hobbies.some(cat => h.includes(cat) || cat.includes(h))) return category;
  }
  return 'other';
}

/**
 * Hard dealbreaker filter — returns true if candidate should be rejected.
 */
function isDealbreakerViolation(seeker, candidate) {
  const db = seeker.dealbreakers || {};

  // No smokers dealbreaker
  if (db.noSmokers && candidate.smoking) return { violated: true, reason: 'Smoker rejected by dealbreaker' };

  // No drinkers dealbreaker
  if (db.noDrinkers && candidate.drinking) return { violated: true, reason: 'Drinker rejected by dealbreaker' };

  // Budget range ZERO overlap
  const sMin = seeker.budgetRange?.min || 0;
  const sMax = seeker.budgetRange?.max || 99999;
  const cMin = candidate.budgetRange?.min || 0;
  const cMax = candidate.budgetRange?.max || 99999;
  if (Math.min(sMax, cMax) < Math.max(sMin, cMin)) {
    return { violated: true, reason: 'Zero budget overlap' };
  }

  // Max budget dealbreaker
  if (db.maxBudget && candidate.budgetRange?.min > db.maxBudget) {
    return { violated: true, reason: 'Candidate budget exceeds max budget dealbreaker' };
  }

  // Gender preference
  if (db.genderPreference && db.genderPreference !== 'any') {
    if (db.genderPreference === 'same_gender' && seeker.gender !== candidate.gender) {
      return { violated: true, reason: 'Gender preference mismatch' };
    } else if (db.genderPreference === 'male' && candidate.gender !== 'male') {
      return { violated: true, reason: 'Gender preference mismatch (male only)' };
    } else if (db.genderPreference === 'female' && candidate.gender !== 'female') {
      return { violated: true, reason: 'Gender preference mismatch (female only)' };
    }
  }

  // Same city dealbreaker
  if (db.sameCity && seeker.location?.city?.toLowerCase() !== candidate.location?.city?.toLowerCase()) {
    return { violated: true, reason: 'Different city, same city required' };
  }

  return { violated: false };
}

/**
 * Calculate move-in timing compatibility score (0-100).
 */
function computeTimingScore(seeker, candidate) {
  if (!seeker.moveInDate || !candidate.moveInDate) return 50; // neutral if no date
  const seekerDate = new Date(seeker.moveInDate);
  const candidateDate = new Date(candidate.moveInDate);
  const diffMs = Math.abs(seekerDate - candidateDate);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays <= 14) return 100; // within 2 weeks: bonus
  if (diffDays <= 30) return 80;
  if (diffDays <= 60) return 60;
  if (diffDays <= 90) return 40;
  return 20; // 2+ months apart: penalty
}

/**
 * Compute social compatibility score combining introvert/extrovert, guests, noise.
 */
function computeSocialScore(seeker, candidate) {
  const noiseMap = { low: 1, medium: 2, high: 3 };
  const guestMap = { low: 1, medium: 2, high: 3 };

  const seekerSocial = (seeker.introvertExtrovertScale || 3) +
    (guestMap[seeker.guestsFrequency] || 2) +
    (noiseMap[seeker.noiseTolerance] || 2);
  const candidateSocial = (candidate.introvertExtrovertScale || 3) +
    (guestMap[candidate.guestsFrequency] || 2) +
    (noiseMap[candidate.noiseTolerance] || 2);

  const diff = Math.abs(seekerSocial - candidateSocial);
  // Max possible diff = (5+3+3) - (1+1+1) = 8
  return Math.max(0, Math.round(100 - (diff / 8) * 100));
}

/**
 * Compute hobby similarity with category-based partial credit.
 */
function computeHobbyScore(seeker, candidate) {
  const seekerHobbies = (seeker.hobbies || []).map(h => h.toLowerCase());
  const candidateHobbies = (candidate.hobbies || []).map(h => h.toLowerCase());

  if (seekerHobbies.length === 0 || candidateHobbies.length === 0) return 50;

  let totalPoints = 0;
  const maxPoints = seekerHobbies.length * 10;

  seekerHobbies.forEach(sh => {
    if (candidateHobbies.includes(sh)) {
      totalPoints += 10; // exact match
    } else {
      const shCategory = getHobbyCategory(sh);
      const hasSameCategory = candidateHobbies.some(ch => getHobbyCategory(ch) === shCategory && shCategory !== 'other');
      if (hasSameCategory) totalPoints += 5; // category match = partial credit
    }
  });

  return Math.min(100, Math.round((totalPoints / maxPoints) * 100));
}

/**
 * Get match tier based on score.
 */
function getMatchTier(score) {
  if (score >= 85) return { tier: 'Perfect Match', emoji: '🏆', description: 'This is your ideal roommate', color: 'green' };
  if (score >= 70) return { tier: 'Great Match', emoji: '✅', description: 'Strong compatibility', color: 'emerald' };
  if (score >= 50) return { tier: 'Good Match', emoji: '🟡', description: 'Works with some adjustments', color: 'yellow' };
  if (score >= 30) return { tier: 'Fair Match', emoji: '🟠', description: 'Significant differences', color: 'orange' };
  return { tier: 'Poor Match', emoji: '🔴', description: 'Not recommended', color: 'red' };
}

/**
 * Generate top 3 reasons this match works (or doesn't).
 */
function generateTopReasons(seeker, candidate, breakdown, score) {
  const reasons = [];

  // Positive reasons
  if (breakdown.intentAlignment?.score >= 70) {
    reasons.push({ type: 'positive', text: `Both in "${candidate.lifeIntent?.lifeMode || 'balanced'}" mode — aligned life phase.` });
  }
  if (breakdown.lifestyleCompatibility?.score >= 70) {
    reasons.push({ type: 'positive', text: 'Highly compatible daily lifestyle habits.' });
  }
  if (breakdown.socialCompatibility?.score >= 70) {
    reasons.push({ type: 'positive', text: 'Matching social energy — similar preferences for guests and noise.' });
  }
  if (breakdown.hobbyCompatibility?.score >= 60) {
    const sharedHobbies = (seeker.hobbies || []).filter(h => (candidate.hobbies || []).map(c => c.toLowerCase()).includes(h.toLowerCase()));
    if (sharedHobbies.length > 0) {
      reasons.push({ type: 'positive', text: `Shared hobbies: ${sharedHobbies.slice(0, 3).join(', ')}.` });
    } else {
      reasons.push({ type: 'positive', text: 'Similar hobby interests and activity preferences.' });
    }
  }
  if (breakdown.budgetOverlap?.score >= 80) {
    reasons.push({ type: 'positive', text: 'Excellent budget alignment.' });
  }
  if (breakdown.locationMatch?.score === 100) {
    reasons.push({ type: 'positive', text: `Both in ${seeker.location?.city} — same city!` });
  }

  // Negative reasons
  if (breakdown.intentAlignment?.score < 40) {
    reasons.push({ type: 'negative', text: 'Different life modes may cause friction.' });
  }
  if (breakdown.lifestyleCompatibility?.score < 40) {
    reasons.push({ type: 'negative', text: 'Notable lifestyle differences to work through.' });
  }
  if (breakdown.budgetOverlap?.score < 30) {
    reasons.push({ type: 'negative', text: 'Budget ranges have limited overlap.' });
  }

  // Sort: positives first
  reasons.sort((a, b) => (a.type === 'positive' ? -1 : 1));

  return reasons.slice(0, 3);
}

function computeMatchScore(seeker, candidate) {
  const breakdown = {};
  let totalScore = 0;
  let totalWeight = 0;

  // ── 1. LIFE INTENT ALIGNMENT (weight: 25) ──
  const intentWeight = 25;
  let intentScore = 0;

  const seekerMode = seeker.lifeIntent?.lifeMode || 'balanced';
  const candidateMode = candidate.lifeIntent?.lifeMode || 'balanced';

  if (seekerMode === candidateMode) {
    intentScore += 40;
  } else if (seekerMode === 'balanced' || candidateMode === 'balanced') {
    intentScore += 25;
  } else {
    intentScore += 5;
  }

  const seekerSS = seeker.lifeIntent?.struggleStabilityScale || 3;
  const candidateSS = candidate.lifeIntent?.struggleStabilityScale || 3;
  const ssDiff = Math.abs(seekerSS - candidateSS);
  intentScore += Math.max(0, 30 - ssDiff * 8);

  const seekerGoals = seeker.lifeIntent?.lifeGoals || [];
  const candidateGoals = candidate.lifeIntent?.lifeGoals || [];
  const sharedGoals = seekerGoals.filter(g => candidateGoals.includes(g));
  intentScore += Math.min(sharedGoals.length * 10, 30);

  breakdown.intentAlignment = {
    score: Math.round(Math.min(100, intentScore)),
    max: 100,
    details: { seekerMode, candidateMode, ssDiff, sharedGoals }
  };
  totalScore += (Math.min(100, intentScore) / 100) * intentWeight;
  totalWeight += intentWeight;

  // ── 2. LIFESTYLE COMPATIBILITY (weight: 25) ──
  const lifestyleWeight = 25;
  let lifestyleScore = 0;

  const cleanDiff = Math.abs(
    (seeker.cleanlinessLevel || 3) - (candidate.cleanlinessLevel || 3)
  );
  lifestyleScore += Math.max(0, 25 - cleanDiff * 7);

  const seekerSleep = seeker.sleepSchedule || 'flexible';
  const candidateSleep = candidate.sleepSchedule || 'flexible';
  if (seekerSleep === candidateSleep) lifestyleScore += 20;
  else if (seekerSleep === 'flexible' || candidateSleep === 'flexible') lifestyleScore += 12;
  else lifestyleScore += 2;

  if (seeker.smoking !== candidate.smoking) lifestyleScore -= 5;
  else lifestyleScore += 15;

  if (seeker.drinking !== candidate.drinking) lifestyleScore -= 2;
  else lifestyleScore += 10;

  const noiseMap = { low: 1, medium: 2, high: 3 };
  const noiseDiff = Math.abs(
    (noiseMap[seeker.noiseTolerance] || 2) - (noiseMap[candidate.noiseTolerance] || 2)
  );
  lifestyleScore += Math.max(0, 15 - noiseDiff * 7);

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

  // ── 3. SOCIAL COMPATIBILITY (weight: 20) ──
  const socialWeight = 20;
  const socialScore = computeSocialScore(seeker, candidate);

  // Weekend style bonus
  const seekerWknd = seeker.weekendStyle || 'mixed';
  const candidateWknd = candidate.weekendStyle || 'mixed';
  let weekendBonus = 0;
  if (seekerWknd === candidateWknd) weekendBonus = 20;
  else if (seekerWknd === 'mixed' || candidateWknd === 'mixed') weekendBonus = 10;

  const combinedPersonalitySocial = Math.min(100, Math.round((socialScore * 0.8) + weekendBonus));

  breakdown.socialCompatibility = {
    score: combinedPersonalitySocial,
    max: 100,
    details: { socialScore, weekendBonus, ieDiff: Math.abs((seeker.introvertExtrovertScale || 3) - (candidate.introvertExtrovertScale || 3)) }
  };
  totalScore += (combinedPersonalitySocial / 100) * socialWeight;
  totalWeight += socialWeight;

  // ── 4. HOBBY COMPATIBILITY (included in personality, separate breakdown) ──
  const hobbyScore = computeHobbyScore(seeker, candidate);
  breakdown.hobbyCompatibility = { score: hobbyScore, max: 100 };
  // Hobby contributes to social weight (already counted, just for display)

  // ── 5. BUDGET OVERLAP (weight: 15) ──
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

  // ── 6. LOCATION MATCH (weight: 10) ──
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

  // ── 7. MOVE-IN TIMING (weight: 5) ──
  const timingWeight = 5;
  const timingScore = computeTimingScore(seeker, candidate);
  breakdown.moveInTiming = { score: timingScore, max: 100 };
  totalScore += (timingScore / 100) * timingWeight;
  totalWeight += timingWeight;

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
    .filter(candidate => {
      const { violated } = isDealbreakerViolation(seeker, candidate);
      return !violated;
    })
    .map(candidate => {
      const { finalScore, breakdown } = computeMatchScore(seeker, candidate);
      const conflicts = predictConflicts(seeker, candidate);
      const explanations = explanation.generateExplanations(seeker, candidate, breakdown, conflicts);
      const tier = getMatchTier(finalScore);
      const topReasons = generateTopReasons(seeker, candidate, breakdown, finalScore);

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
          hobbies: candidate.hobbies,
          avatar: candidate.avatar
        },
        matchScore: finalScore,
        tier,
        topReasons,
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

module.exports = { computeMatchScore, predictConflicts, findMatches, getMatchTier, isDealbreakerViolation };
