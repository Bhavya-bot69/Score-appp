import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  Calculate,
  EmojiEvents,
  TrendingUp,
} from '@mui/icons-material';
import Navigation from '../components/Navigation';
import { processCompleteJudging } from '../utils/scoringCalculations';
import { eventService } from '../services/eventService';

function AdminResults() {
  const { eventId } = useParams();
  const [judgeScores, setJudgeScores] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [judges, setJudges] = useState([]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const loadData = async () => {
    try {
      const eventTeams = await eventService.getTeamsByEvent(eventId);
      setTeams(eventTeams);

      const eventJudges = await eventService.getJudgesByEvent(eventId);
      setJudges(eventJudges);

      const allScores = await eventService.getScoresByEvent(eventId);

      const judgeScoresMap = {};
      allScores.forEach(score => {
        if (!judgeScoresMap[score.judge_id]) {
          const judge = eventJudges.find(j => j.id === score.judge_id);
          judgeScoresMap[score.judge_id] = {
            judgeId: score.judge_id,
            judgeName: judge?.name || 'Unknown Judge',
            round: score.round,
            scores: {}
          };
        }

        if (!judgeScoresMap[score.judge_id].scores[score.team_id]) {
          judgeScoresMap[score.judge_id].scores[score.team_id] = {};
        }

        judgeScoresMap[score.judge_id].scores[score.team_id][score.criterion_key] = score.score;
      });

      setJudgeScores(Object.values(judgeScoresMap));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCalculateResults = () => {
    setLoading(true);

    const round1Scores = {};
    const round2Scores = {};

    judgeScores.forEach(submission => {
      if (submission.round === 1) {
        round1Scores[submission.judgeId] = submission.scores;
      } else if (submission.round === 2) {
        round2Scores[submission.judgeId] = submission.scores;
      }
    });

    const calculatedResults = processCompleteJudging(round1Scores, round2Scores);

    setResults(calculatedResults);
    setLoading(false);

    localStorage.setItem(`results_${eventId}`, JSON.stringify(calculatedResults));
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === parseInt(teamId));
    return team?.name || `Team ${teamId}`;
  };

  const getJudgeName = (judgeId) => {
    const judge = judges.find(j => j.id === parseInt(judgeId));
    return judge?.name || `Judge ${judgeId}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Navigation breadcrumb="Dashboard / Results" />

      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 4, py: 4 }}>
        <Card sx={{ p: 4, mb: 4, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Event Results
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                View and calculate final rankings with normalization
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Calculate />}
              onClick={handleCalculateResults}
              disabled={loading || judgeScores.length === 0}
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
              }}
            >
              Calculate Results
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip
              label={`${judgeScores.length} Judge Submissions`}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={`${teams.length} Total Teams`}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Card>

        {judgeScores.length === 0 && (
          <Alert severity="info" sx={{ mb: 4 }}>
            No judge scores have been submitted yet. Waiting for judges to push their scores to the admin dashboard.
          </Alert>
        )}

        {judgeScores.length > 0 && (
          <Card sx={{ mb: 4, borderRadius: '16px', overflow: 'hidden' }}>
            <Box sx={{ p: 3, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Judge Submissions
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {judgeScores.map((submission, idx) => (
                <Accordion key={idx} sx={{ mb: 2, '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 600 }}>{submission.judgeName}</Typography>
                      <Chip label={`Round ${submission.round}`} size="small" color="primary" />
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {Object.keys(submission.scores).length} teams scored
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', background: '#fafafa' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Innovation</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Execution</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Presentation</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Impact</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(submission.scores).map(([teamId, scores]) => {
                            const total = Object.values(scores).reduce((sum, s) => sum + parseFloat(s), 0);
                            return (
                              <TableRow key={teamId}>
                                <TableCell>{getTeamName(teamId)}</TableCell>
                                <TableCell>{scores.innovation}</TableCell>
                                <TableCell>{scores.execution}</TableCell>
                                <TableCell>{scores.presentation}</TableCell>
                                <TableCell>{scores.impact}</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>{total.toFixed(2)}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Card>
        )}

        {results && (
          <>
            <Card sx={{ mb: 4, borderRadius: '16px', overflow: 'hidden' }}>
              <Box sx={{ p: 3, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Round 1 Results - Normalized Scores
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Top 2 teams selected from each judge
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 3 }}>
                {Object.entries(results.round1.normalizedScores).map(([judgeId, scores]) => (
                  <Box key={judgeId} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                      {getJudgeName(judgeId)}
                    </Typography>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', background: '#fafafa' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Raw Score</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Normalized Score</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Percentile</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Selected</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {scores.map((score, idx) => (
                            <TableRow
                              key={score.teamId}
                              sx={{
                                background: idx < 2 ? '#ecfdf5' : 'transparent'
                              }}
                            >
                              <TableCell sx={{ fontWeight: 600 }}>{score.rank}</TableCell>
                              <TableCell>{getTeamName(score.teamId)}</TableCell>
                              <TableCell>{score.rawScore.toFixed(2)}</TableCell>
                              <TableCell>{score.normalizedScore.toFixed(3)}</TableCell>
                              <TableCell>{score.percentile.toFixed(1)}%</TableCell>
                              <TableCell>
                                {idx < 2 && (
                                  <Chip label="Selected" size="small" color="success" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Divider sx={{ my: 3 }} />
                  </Box>
                ))}
              </Box>
            </Card>

            <Card sx={{ mb: 4, borderRadius: '16px', overflow: 'hidden' }}>
              <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <EmojiEvents sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Final Results - Round 2
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      All judges scored selected teams together
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 3 }}>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Final Score</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Std Deviation</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Judge Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.round2.finalResults.map((result) => (
                        <TableRow
                          key={result.teamId}
                          sx={{
                            background: result.finalRank <= 3 ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'transparent',
                            fontWeight: result.finalRank <= 3 ? 700 : 400
                          }}
                        >
                          <TableCell sx={{ fontWeight: 700, fontSize: result.finalRank <= 3 ? '1.2rem' : '1rem' }}>
                            {result.finalRank === 1 && '🥇 '}
                            {result.finalRank === 2 && '🥈 '}
                            {result.finalRank === 3 && '🥉 '}
                            {result.finalRank}
                          </TableCell>
                          <TableCell sx={{ fontWeight: result.finalRank <= 3 ? 700 : 500 }}>
                            {getTeamName(result.teamId)}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{result.finalScore.toFixed(3)}</TableCell>
                          <TableCell>{result.standardDeviation.toFixed(3)}</TableCell>
                          <TableCell>{result.scoreCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {results.correlation && (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {results.correlation.message}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                      Correlation coefficient ranges from -1 to 1. Values closer to 1 indicate strong agreement between judges.
                    </Typography>
                  </Alert>
                )}
              </Box>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
}

export default AdminResults;
