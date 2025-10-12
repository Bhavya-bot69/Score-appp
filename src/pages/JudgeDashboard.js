import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AssignmentInd, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { eventService } from '../services/eventService';

function JudgeDashboard() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [judge, setJudge] = useState(null);
  const [assignedTeams, setAssignedTeams] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [currentRound] = useState(1);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedTeams, setSubmittedTeams] = useState(new Set());

  useEffect(() => {
    if (!token) {
      setError('No access token provided. Please use the link from your invitation email.');
      setLoading(false);
      return;
    }

    loadJudgeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadJudgeData = async () => {
    try {
      console.log('Looking for token:', token);

      const foundJudge = await eventService.getJudgeByToken(token);

      if (!foundJudge) {
        setError(`Invalid access token. Please check your invitation link. Token received: ${token}`);
        setLoading(false);
        return;
      }

      console.log('Found judge:', foundJudge);
      setJudge(foundJudge);

      const assignedTeamIds = await eventService.getJudgeAssignments(foundJudge.id);
      console.log('Assigned team IDs:', assignedTeamIds);

      const eventTeams = await eventService.getTeamsByEvent(foundJudge.event_id);
      console.log('Event teams:', eventTeams);

      const assigned = eventTeams.filter(team => assignedTeamIds.includes(team.id));
      console.log('Filtered assigned teams:', assigned);
      setAssignedTeams(assigned);

      // Load criteria for the event
      const eventCriteria = await eventService.getCriteriaByEvent(foundJudge.event_id);
      console.log('Event criteria:', eventCriteria);
      setCriteria(eventCriteria);

      const existingScores = await eventService.getScoresByJudge(foundJudge.id);
      console.log('Existing scores:', existingScores);

      const scoresMap = {};
      const submitted = new Set();

      existingScores.forEach(score => {
        if (!scoresMap[score.team_id]) {
          scoresMap[score.team_id] = {};
        }
        scoresMap[score.team_id][score.criterion_key] = score.score;
      });

      // Check if all criteria are filled for each team
      assigned.forEach(team => {
        const teamScores = scoresMap[team.id] || {};
        const allFilled = eventCriteria.every(c => teamScores[c.id] !== undefined && teamScores[c.id] !== '');
        if (allFilled) {
          submitted.add(team.id);
        }
      });

      setScores(scoresMap);
      setSubmittedTeams(submitted);
      setLoading(false);
    } catch (error) {
      console.error('Error loading judge data:', error);
      setError(`Failed to load judge data: ${error.message}`);
      setLoading(false);
    }
  };

  const handleScoreChange = (teamId, criterionId, value, maxScore) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > maxScore) return;

    setScores(prev => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [criterionId]: numValue
      }
    }));
  };

  const handleSubmitScores = async (teamId) => {
    const teamScores = scores[teamId] || {};
    const allFilled = criteria.every(c => teamScores[c.id] !== undefined && teamScores[c.id] !== '');

    if (!allFilled) {
      alert('Please fill in all criteria scores before submitting.');
      return;
    }

    try {
      for (const criterion of criteria) {
        await eventService.upsertScore({
          judge_id: judge.id,
          team_id: teamId,
          criterion_key: criterion.id,
          score: teamScores[criterion.id],
          round: currentRound
        });
      }

      const newSubmitted = new Set(submittedTeams);
      newSubmitted.add(teamId);
      setSubmittedTeams(newSubmitted);

      alert('Scores submitted successfully!');
    } catch (error) {
      console.error('Error submitting scores:', error);
      alert('Failed to submit scores. Please try again.');
    }
  };

  const handlePushToAdmin = () => {
    if (submittedTeams.size !== assignedTeams.length) {
      alert('Please score all assigned teams before pushing to admin.');
      return;
    }

    alert('All scores are automatically synced to the admin dashboard!');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#f5f7fa', p: 4 }}>
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Debug Information</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Token from URL:</Typography>
              <TextField
                fullWidth
                size="small"
                value={token || 'No token provided'}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                console.log('Manual debug triggered');
                console.log('Token:', token);
                const allKeys = Object.keys(localStorage).filter(k => k.startsWith('judges_'));
                console.log('Judge keys in localStorage:', allKeys);
                allKeys.forEach(key => {
                  const data = JSON.parse(localStorage.getItem(key) || '[]');
                  console.log(`${key}:`, data);
                });
              }}
            >
              Log Debug Info to Console
            </Button>
          </Card>
        </Box>
      </Box>
    );
  }

  // Criteria are now loaded from database in loadJudgeData()

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f7fa', p: 4 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Card sx={{ p: 4, mb: 4, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssignmentInd sx={{ fontSize: 40, color: '#2563eb', mr: 2 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Judge Dashboard
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Welcome, {judge?.name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Chip
              label={`Round ${currentRound}`}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={`${assignedTeams.length} Teams Assigned`}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={`${submittedTeams.size}/${assignedTeams.length} Scored`}
              color={submittedTeams.size === assignedTeams.length ? 'success' : 'warning'}
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Card>

        {assignedTeams.length === 0 ? (
          <Alert severity="info">No teams have been assigned to you yet.</Alert>
        ) : (
          <Box>
            {assignedTeams.map((team) => {
              const teamScores = scores[team.id] || {};
              const isSubmitted = submittedTeams.has(team.id);

              return (
                <Card key={team.id} sx={{ mb: 3, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                  <Box sx={{ p: 3, background: isSubmitted ? '#ecfdf5' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {team.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {team.projectTitle || 'No project title'}
                        </Typography>
                      </Box>
                      {isSubmitted ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="Submitted"
                          color="success"
                          sx={{ fontWeight: 600 }}
                        />
                      ) : (
                        <Chip
                          icon={<HourglassEmpty />}
                          label="Pending"
                          color="warning"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Box>
                  </Box>

                  <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ background: '#fafafa' }}>
                          <TableCell sx={{ fontWeight: 700 }}>Criterion</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Score (0-10)</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Weight</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {criteria.map((criterion) => (
                          <TableRow key={criterion.id}>
                            <TableCell sx={{ fontWeight: 600 }}>{criterion.name}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                size="small"
                                value={teamScores[criterion.id] || ''}
                                onChange={(e) => handleScoreChange(team.id, criterion.id, e.target.value, criterion.max_score)}
                                disabled={isSubmitted}
                                inputProps={{ min: 0, max: criterion.max_score, step: 0.1 }}
                                sx={{ width: '120px' }}
                                helperText={`Max: ${criterion.max_score}`}
                              />
                            </TableCell>
                            <TableCell>{criterion.weight}x</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={() => handleSubmitScores(team.id)}
                      disabled={isSubmitted}
                      sx={{
                        background: isSubmitted ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        px: 4,
                        py: 1.2,
                        fontWeight: 600,
                        borderRadius: '10px',
                        '&:hover': {
                          background: isSubmitted ? '#9ca3af' : 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                        }
                      }}
                    >
                      {isSubmitted ? 'Scores Submitted' : 'Submit Scores'}
                    </Button>
                  </Box>
                </Card>
              );
            })}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handlePushToAdmin}
                disabled={submittedTeams.size !== assignedTeams.length}
                sx={{
                  background: submittedTeams.size === assignedTeams.length
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : '#9ca3af',
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    background: submittedTeams.size === assignedTeams.length
                      ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                      : '#9ca3af',
                  }
                }}
              >
                Push All Scores to Admin Dashboard
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default JudgeDashboard;
