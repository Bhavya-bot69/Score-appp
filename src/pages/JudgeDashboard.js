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

function JudgeDashboard() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [judge, setJudge] = useState(null);
  const [assignedTeams, setAssignedTeams] = useState([]);
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

  const loadJudgeData = () => {
    const allJudges = [];
    const eventKeys = Object.keys(localStorage).filter(key => key.startsWith('judges_'));

    eventKeys.forEach(key => {
      const eventJudges = JSON.parse(localStorage.getItem(key) || '[]');
      allJudges.push(...eventJudges.map(j => ({ ...j, eventId: key.replace('judges_', '') })));
    });

    const foundJudge = allJudges.find(j => j.token === token);

    if (!foundJudge) {
      setError('Invalid access token. Please check your invitation link.');
      setLoading(false);
      return;
    }

    setJudge(foundJudge);

    const eventTeams = JSON.parse(localStorage.getItem(`teams_${foundJudge.eventId}`) || '[]');
    const assigned = eventTeams.filter(team =>
      (foundJudge.assignedTeams || []).includes(team.id)
    );
    setAssignedTeams(assigned);

    const savedScores = JSON.parse(localStorage.getItem(`scores_${foundJudge.id}`) || '{}');
    setScores(savedScores);

    const saved = JSON.parse(localStorage.getItem(`submitted_${foundJudge.id}`) || '[]');
    setSubmittedTeams(new Set(saved));

    setLoading(false);
  };

  const handleScoreChange = (teamId, criterion, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 10) return;

    setScores(prev => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [criterion]: numValue
      }
    }));
  };

  const handleSubmitScores = (teamId) => {
    const teamScores = scores[teamId] || {};
    const criteria = ['innovation', 'execution', 'presentation', 'impact'];
    const allFilled = criteria.every(c => teamScores[c] !== undefined && teamScores[c] !== '');

    if (!allFilled) {
      alert('Please fill in all criteria scores before submitting.');
      return;
    }

    localStorage.setItem(`scores_${judge.id}`, JSON.stringify(scores));

    const newSubmitted = new Set(submittedTeams);
    newSubmitted.add(teamId);
    setSubmittedTeams(newSubmitted);

    localStorage.setItem(`submitted_${judge.id}`, JSON.stringify([...newSubmitted]));

    alert('Scores submitted successfully!');
  };

  const handlePushToAdmin = () => {
    if (submittedTeams.size !== assignedTeams.length) {
      alert('Please score all assigned teams before pushing to admin.');
      return;
    }

    localStorage.setItem(`admin_scores_${judge.id}`, JSON.stringify({
      judgeId: judge.id,
      judgeName: judge.name,
      eventId: judge.eventId,
      scores: scores,
      submittedAt: new Date().toISOString(),
      round: currentRound
    }));

    alert('All scores have been pushed to admin dashboard!');
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const criteria = [
    { key: 'innovation', label: 'Innovation', weight: 1 },
    { key: 'execution', label: 'Execution', weight: 1 },
    { key: 'presentation', label: 'Presentation', weight: 1 },
    { key: 'impact', label: 'Impact', weight: 1 },
  ];

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
                          <TableRow key={criterion.key}>
                            <TableCell sx={{ fontWeight: 600 }}>{criterion.label}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                size="small"
                                value={teamScores[criterion.key] || ''}
                                onChange={(e) => handleScoreChange(team.id, criterion.key, e.target.value)}
                                disabled={isSubmitted}
                                inputProps={{ min: 0, max: 10, step: 0.1 }}
                                sx={{ width: '120px' }}
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
