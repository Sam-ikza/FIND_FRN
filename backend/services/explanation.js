/**
 * Generate human-readable explanations for match results.
 */

function generateExplanations(seeker, candidate, breakdown, conflicts) {
  const explanations = [];

  // ── Intent Alignment ──
  const intent = breakdown.intentAlignment;
  if (intent) {
    const { seekerMode, candidateMode, sharedGoals } = intent.details;
    if (seekerMode === candidateMode) {
      explanations.push({
        category: 'Intent Alignment',
        type: 'positive',
        text: `Both of you are in "${seekerMode}" life mode — you'll understand each other's pace and priorities.`
      });
    } else if (seekerMode === 'balanced' || candidateMode === 'balanced') {
      explanations.push({
        category: 'Intent Alignment',
        type: 'neutral',
        text: `One of you is in "balanced" mode, which is adaptable. Minor adjustments may be needed.`
      });
    } else {
      explanations.push({
        category: 'Intent Alignment',
        type: 'negative',
        text: `You're in "${seekerMode}" mode, they're in "${candidateMode}" mode. This is the biggest predictor of roommate friction.`
      });
    }

    if (sharedGoals.length > 0) {
      const goalLabels = sharedGoals.map(g => g.replace(/_/g, ' ')).join(', ');
      explanations.push({
        category: 'Shared Goals',
        type: 'positive',
        text: `You both share ${sharedGoals.length} life goal(s): ${goalLabels}. Shared purpose builds stronger co-living.`
      });
    }
  }

  // ── Lifestyle ──
  const lifestyle = breakdown.lifestyleCompatibility;
  if (lifestyle) {
    if (lifestyle.score >= 70) {
      explanations.push({
        category: 'Lifestyle',
        type: 'positive',
        text: `Your daily habits (sleep, cleanliness, noise) are well aligned. Fewer day-to-day irritations.`
      });
    } else if (lifestyle.score >= 40) {
      explanations.push({
        category: 'Lifestyle',
        type: 'neutral',
        text: `Some lifestyle differences exist. Workable with clear ground rules.`
      });
    } else {
      explanations.push({
        category: 'Lifestyle',
        type: 'negative',
        text: `Significant lifestyle gaps. Cleanliness, sleep, or noise differences could cause daily tension.`
      });
    }
  }

  // ── Personality ──
  const personality = breakdown.personalityFit;
  if (personality) {
    if (personality.details.sharedHobbies.length > 0) {
      explanations.push({
        category: 'Personality',
        type: 'positive',
        text: `You share interests: ${personality.details.sharedHobbies.join(', ')}. Common ground for bonding.`
      });
    }
    if (personality.details.ieDiff >= 3) {
      explanations.push({
        category: 'Personality',
        type: 'negative',
        text: `Very different social styles — one needs space, the other needs people. Set boundaries early.`
      });
    }
  }

  // ── Budget ──
  const budget = breakdown.budgetOverlap;
  if (budget) {
    if (budget.score >= 80) {
      explanations.push({
        category: 'Budget',
        type: 'positive',
        text: `Strong budget overlap. You're looking in the same financial range.`
      });
    } else if (budget.score >= 40) {
      explanations.push({
        category: 'Budget',
        type: 'neutral',
        text: `Partial budget overlap. Might work, but discuss finances early.`
      });
    } else {
      explanations.push({
        category: 'Budget',
        type: 'negative',
        text: `Little to no budget overlap. Financial expectations don't align.`
      });
    }
  }

  // ── Cultural ──
  const cultural = breakdown.culturalOpenness;
  if (cultural && cultural.details) {
    if (cultural.details.seekerCultural === 'explorer') {
      explanations.push({
        category: 'Cultural Openness',
        type: 'positive',
        text: `You're open to diverse cultural backgrounds — this widens your match pool.`
      });
    }
    if (cultural.score <= 20) {
      explanations.push({
        category: 'Cultural Openness',
        type: 'negative',
        text: `Your state/cultural preference doesn't match this person's background.`
      });
    }
  }

  // ── Conflict summary ──
  const highConflicts = conflicts.filter(c => c.severity === 'high');
  if (highConflicts.length > 0) {
    explanations.push({
      category: 'Conflict Warning',
      type: 'negative',
      text: `${highConflicts.length} high-severity conflict(s) predicted. Review carefully before deciding.`
    });
  } else if (conflicts.length === 0) {
    explanations.push({
      category: 'Conflict Check',
      type: 'positive',
      text: `No major conflicts predicted. This is a promising match!`
    });
  }

  return explanations;
}

module.exports = { generateExplanations };
