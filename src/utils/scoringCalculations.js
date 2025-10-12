export const calculateNormalizedScores = (judgeScores) => {
  const teamScores = [];

  Object.entries(judgeScores).forEach(([teamId, scores]) => {
    const criteriaScores = Object.values(scores);
    const totalScore = criteriaScores.reduce((sum, score) => sum + parseFloat(score), 0);
    const avgScore = totalScore / criteriaScores.length;

    teamScores.push({
      teamId,
      rawScore: totalScore,
      avgScore: avgScore
    });
  });

  teamScores.sort((a, b) => b.avgScore - a.avgScore);

  const minScore = Math.min(...teamScores.map(t => t.avgScore));
  const maxScore = Math.max(...teamScores.map(t => t.avgScore));
  const range = maxScore - minScore;

  teamScores.forEach((team, index) => {
    if (range === 0) {
      team.normalizedScore = 1.0;
    } else {
      team.normalizedScore = ((team.avgScore - minScore) / range);
    }

    team.rank = index + 1;
    team.percentile = ((teamScores.length - index) / teamScores.length) * 100;
  });

  return teamScores;
};

export const selectTopTeamsPerJudge = (normalizedScoresByJudge, topN = 2) => {
  const selectedTeams = new Set();
  const selectionDetails = [];

  Object.entries(normalizedScoresByJudge).forEach(([judgeId, scores]) => {
    const topTeams = scores
      .sort((a, b) => b.normalizedScore - a.normalizedScore)
      .slice(0, topN);

    topTeams.forEach(team => {
      selectedTeams.add(team.teamId);
      selectionDetails.push({
        judgeId,
        teamId: team.teamId,
        normalizedScore: team.normalizedScore,
        rank: team.rank,
        percentile: team.percentile
      });
    });
  });

  return {
    selectedTeamIds: Array.from(selectedTeams),
    selectionDetails
  };
};

export const calculateRound2Scores = (round2JudgeScores) => {
  const teamAggregateScores = {};

  Object.entries(round2JudgeScores).forEach(([judgeId, teamScores]) => {
    Object.entries(teamScores).forEach(([teamId, scores]) => {
      if (!teamAggregateScores[teamId]) {
        teamAggregateScores[teamId] = {
          teamId,
          totalScores: [],
          judgeScores: {}
        };
      }

      const criteriaScores = Object.values(scores);
      const totalScore = criteriaScores.reduce((sum, score) => sum + parseFloat(score), 0);
      const avgScore = totalScore / criteriaScores.length;

      teamAggregateScores[teamId].totalScores.push(avgScore);
      teamAggregateScores[teamId].judgeScores[judgeId] = avgScore;
    });
  });

  const finalScores = Object.values(teamAggregateScores).map(team => {
    const avgScore = team.totalScores.reduce((sum, score) => sum + score, 0) / team.totalScores.length;
    const variance = team.totalScores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / team.totalScores.length;
    const stdDev = Math.sqrt(variance);

    return {
      teamId: team.teamId,
      finalScore: avgScore,
      standardDeviation: stdDev,
      judgeScores: team.judgeScores,
      scoreCount: team.totalScores.length
    };
  });

  finalScores.sort((a, b) => b.finalScore - a.finalScore);

  finalScores.forEach((team, index) => {
    team.finalRank = index + 1;
  });

  return finalScores;
};

export const calculateCorrelation = (judgeScores) => {
  const judges = Object.keys(judgeScores);
  if (judges.length < 2) {
    return { correlation: null, message: 'Need at least 2 judges for correlation' };
  }

  const judge1 = judges[0];
  const judge2 = judges[1];

  const teams = Object.keys(judgeScores[judge1]);

  if (teams.length < 2) {
    return { correlation: null, message: 'Need at least 2 teams for correlation' };
  }

  const scores1 = teams.map(teamId => judgeScores[judge1][teamId]);
  const scores2 = teams.map(teamId => judgeScores[judge2][teamId]);

  const mean1 = scores1.reduce((sum, val) => sum + val, 0) / scores1.length;
  const mean2 = scores2.reduce((sum, val) => sum + val, 0) / scores2.length;

  const numerator = scores1.reduce((sum, val, i) => sum + (val - mean1) * (scores2[i] - mean2), 0);
  const denominator1 = Math.sqrt(scores1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0));
  const denominator2 = Math.sqrt(scores2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0));

  if (denominator1 === 0 || denominator2 === 0) {
    return { correlation: 0, message: 'No variance in scores' };
  }

  const correlation = numerator / (denominator1 * denominator2);

  return {
    correlation: correlation.toFixed(3),
    message: `Correlation between ${judge1} and ${judge2}: ${correlation.toFixed(3)}`
  };
};

export const processCompleteJudging = (round1Scores, round2Scores) => {
  const round1Normalized = {};

  Object.entries(round1Scores).forEach(([judgeId, scores]) => {
    round1Normalized[judgeId] = calculateNormalizedScores(scores);
  });

  const { selectedTeamIds, selectionDetails } = selectTopTeamsPerJudge(round1Normalized, 2);

  const finalResults = calculateRound2Scores(round2Scores);

  const judgeScoresForCorrelation = {};
  Object.entries(round2Scores).forEach(([judgeId, teamScores]) => {
    judgeScoresForCorrelation[judgeId] = {};
    Object.entries(teamScores).forEach(([teamId, scores]) => {
      const criteriaScores = Object.values(scores);
      const avgScore = criteriaScores.reduce((sum, score) => sum + parseFloat(score), 0) / criteriaScores.length;
      judgeScoresForCorrelation[judgeId][teamId] = avgScore;
    });
  });

  const correlationResult = calculateCorrelation(judgeScoresForCorrelation);

  return {
    round1: {
      normalizedScores: round1Normalized,
      selectedForRound2: selectedTeamIds,
      selectionDetails
    },
    round2: {
      finalResults,
      topThreeTeams: finalResults.slice(0, 3)
    },
    correlation: correlationResult
  };
};
