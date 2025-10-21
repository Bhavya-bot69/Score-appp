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
  const [absentTeams, setAbsentTeams] = useState(new Set());

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

      // Track absent teams
      const absent = new Set(assigned.filter(team => team.is_absent).map(team => team.id));
      setAbsentTeams(absent);

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
    const teamsToScore = assignedTeams.filter(team => !absentTeams.has(team.id));
    if (submittedTeams.size !== teamsToScore.length) {
      alert('Please score all assigned teams (excluding absent teams) before pushing to admin.');
      return;
    }

    alert('All scores are automatically synced to the admin dashboard!');
  };

  const handleMarkAbsent = async (teamId) => {
    try {
      const isCurrentlyAbsent = absentTeams.has(teamId);
      await eventService.markTeamAbsent(teamId, !isCurrentlyAbsent);

      const newAbsentTeams = new Set(absentTeams);
      if (isCurrentlyAbsent) {
        newAbsentTeams.delete(teamId);
      } else {
        newAbsentTeams.add(teamId);
        // Remove from submitted if marking as absent
        const newSubmittedTeams = new Set(submittedTeams);
        newSubmittedTeams.delete(teamId);
        setSubmittedTeams(newSubmittedTeams);
      }
      setAbsentTeams(newAbsentTeams);

      alert(isCurrentlyAbsent ? 'Team marked as present.' : 'Team marked as absent.');
    } catch (error) {
      console.error('Error marking team absent:', error);
      alert('Failed to update team status. Please try again.');
    }
  };

  const handleRemoveTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to remove this team from your assignments?')) {
      return;
    }

    try {
      await eventService.removeJudgeTeamAssignment(judge.id, teamId);
      setAssignedTeams(assignedTeams.filter(team => team.id !== teamId));

      // Clean up state
      const newSubmittedTeams = new Set(submittedTeams);
      newSubmittedTeams.delete(teamId);
      setSubmittedTeams(newSubmittedTeams);

      const newAbsentTeams = new Set(absentTeams);
      newAbsentTeams.delete(teamId);
      setAbsentTeams(newAbsentTeams);

      alert('Team removed from your assignments successfully.');
    } catch (error) {
      console.error('Error removing team:', error);
      alert('Failed to remove team. Please try again.');
    }
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
              label={`${submittedTeams.size}/${assignedTeams.filter(t => !absentTeams.has(t.id)).length} Scored`}
              color={submittedTeams.size === assignedTeams.filter(t => !absentTeams.has(t.id)).length ? 'success' : 'warning'}
              sx={{ fontWeight: 600 }}
            />
            {absentTeams.size > 0 && (
              <Chip
                label={`${absentTeams.size} Absent`}
                color="error"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </Card>

        {assignedTeams.length === 0 ? (
          <Alert severity="info">No teams have been assigned to you yet.</Alert>
        ) : (
          <Box>
            {assignedTeams.map((team) => {
              const teamScores = scores[team.id] || {};
              const isSubmitted = submittedTeams.has(team.id);
              const isAbsent = absentTeams.has(team.id);

              return (
                <Card
                  key={team.id}
                  sx={{
                    mb: 3,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    opacity: isAbsent ? 0.6 : 1,
                    border: isAbsent ? '2px solid #ef4444' : 'none'
                  }}
                >
                  <Box sx={{
                    p: 3,
                    background: isAbsent ? '#fee2e2' : (isSubmitted ? '#ecfdf5' : '#f8fafc'),
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {team.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {team.project_title || 'No project title'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {isAbsent ? (
                          <Chip
                            label="Absent"
                            color="error"
                            sx={{ fontWeight: 600 }}
                          />
                        ) : isSubmitted ? (
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

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant={isAbsent ? "contained" : "outlined"}
                        size="small"
                        onClick={() => handleMarkAbsent(team.id)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: '8px',
                          ...(isAbsent ? {
                            background: '#10b981',
                            '&:hover': { background: '#059669' }
                          } : {
                            borderColor: '#ef4444',
                            color: '#ef4444',
                            '&:hover': {
                              borderColor: '#dc2626',
                              background: '#fef2f2'
                            }
                          })
                        }}
                      >
                        {isAbsent ? 'Mark Present' : 'Mark Absent'}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleRemoveTeam(team.id)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: '8px'
                        }}
                      >
                        Remove Team
                      </Button>
                    </Box>
                  </Box>

                  {!isAbsent && (
                    <>
                      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                              <TableCell sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Criterion</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Max Score</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Your Score</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Weight</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {criteria.map((criterion) => (
                              <TableRow
                                key={criterion.id}
                                sx={{
                                  '&:hover': {
                                    backgroundColor: '#f8fafc'
                                  }
                                }}
                              >
                                <TableCell sx={{ fontWeight: 600, color: '#334155' }}>{criterion.name}</TableCell>
                                <TableCell sx={{ color: '#64748b', fontWeight: 500 }}>{criterion.max_score}</TableCell>
                                <TableCell>
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={teamScores[criterion.id] || ''}
                                    onChange={(e) => handleScoreChange(team.id, criterion.id, e.target.value, criterion.max_score)}
                                    disabled={isSubmitted}
                                    inputProps={{ min: 0, max: criterion.max_score, step: 0.1 }}
                                    sx={{
                                      width: '140px',
                                      '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                          borderColor: '#2563eb'
                                        }
                                      }
                                    }}
                                    placeholder={`0-${criterion.max_score}`}
                                  />
                                </TableCell>
                                <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>{criterion.weight}x</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', background: '#fafafa' }}>
                        <Button
                          variant="contained"
                          onClick={() => handleSubmitScores(team.id)}
                          disabled={isSubmitted}
                          sx={{
                            background: isSubmitted
                              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                              : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            px: 4,
                            py: 1.2,
                            fontWeight: 700,
                            borderRadius: '10px',
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: isSubmitted
                                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                : 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                              transform: isSubmitted ? 'none' : 'translateY(-2px)',
                              boxShadow: isSubmitted ? '0 2px 8px rgba(37, 99, 235, 0.25)' : '0 4px 12px rgba(37, 99, 235, 0.35)'
                            }
                          }}
                        >
                          {isSubmitted ? 'Scores Submitted' : 'Submit Scores'}
                        </Button>
                      </Box>
                    </>
                  )}
                </Card>
              );
            })}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handlePushToAdmin}
                disabled={submittedTeams.size !== assignedTeams.filter(t => !absentTeams.has(t.id)).length}
                sx={{
                  background: submittedTeams.size === assignedTeams.filter(t => !absentTeams.has(t.id)).length
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : '#9ca3af',
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    background: submittedTeams.size === assignedTeams.filter(t => !absentTeams.has(t.id)).length
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
