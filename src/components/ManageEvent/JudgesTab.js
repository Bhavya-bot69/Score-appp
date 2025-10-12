import { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
} from "@mui/icons-material";

function JudgesTab({ judges, venues, categories = [], teams = [], onJudgesChange, eventId, eventName }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [currentJudge, setCurrentJudge] = useState({
    name: "",
    email: "",
    assignedCategories: [],
    assignedTeams: [],
    category: "",
  });
  const [selectedJudge, setSelectedJudge] = useState(null);

  const handleAddJudge = () => {
    setCurrentJudge({ name: "", email: "", assignedCategories: [], assignedTeams: [], category: "" });
    setOpenDialog(true);
  };

  const handleAssignTeams = (judge) => {
    setSelectedJudge(judge);
    setOpenAssignDialog(true);
  };

  const handleSaveAssignments = () => {
    if (!selectedJudge) return;

    const updatedJudges = judges.map((j) =>
      j.id === selectedJudge.id
        ? { ...j, assignedCategories: selectedJudge.assignedCategories, assignedTeams: selectedJudge.assignedTeams }
        : j
    );

    onJudgesChange(updatedJudges);
    setOpenAssignDialog(false);
    setSelectedJudge(null);
  };

  const handleSendInvitation = async (judge) => {
    try {
      const dashboardUrl = `${window.location.origin}/judge-dashboard`;
      const fullUrl = `${dashboardUrl}?token=${judge.token}`;

      const updatedJudges = judges.map((j) =>
        j.id === judge.id ? { ...j, invitationSent: true, invitationSentAt: new Date().toISOString() } : j
      );
      onJudgesChange(updatedJudges);

      const emailBody = `Dear ${judge.name},\n\nYou have been invited to judge the event: ${eventName}\n\nPlease use the link below to access your judging dashboard:\n${fullUrl}\n\nYour access token: ${judge.token}\n\nBest regards,\nEvent Management Team`;

      const mailtoLink = `mailto:${judge.email}?subject=Judge Invitation - ${encodeURIComponent(eventName)}&body=${encodeURIComponent(emailBody)}`;

      window.open(mailtoLink, '_blank');

      const copyToClipboard = async () => {
        try {
          await navigator.clipboard.writeText(fullUrl);
          return true;
        } catch (err) {
          return false;
        }
      };

      const copied = await copyToClipboard();

      alert(`Invitation prepared for ${judge.email}\n\n${copied ? 'Dashboard link copied to clipboard!' : 'Dashboard Link:'}\n${fullUrl}\n\nYour default email client should open with a pre-filled message.`);
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const handleSaveJudge = () => {
    if (!currentJudge.name || !currentJudge.email || !currentJudge.category) {
      alert("Judge name, email, and category are required");
      return;
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newJudge = {
      id: currentJudge.id || Date.now(),
      name: currentJudge.name,
      email: currentJudge.email,
      category: currentJudge.category,
      token: currentJudge.token || token,
      assignedCategories: currentJudge.assignedCategories || [],
      assignedTeams: currentJudge.assignedTeams || [],
      invitationSent: currentJudge.invitationSent || false,
      createdAt: currentJudge.createdAt || new Date().toISOString(),
    };

    let updatedJudges;
    if (currentJudge.id) {
      updatedJudges = judges.map((j) => (j.id === currentJudge.id ? newJudge : j));
    } else {
      updatedJudges = [...judges, newJudge];
    }

    onJudgesChange(updatedJudges);
    setOpenDialog(false);
  };

  const handleDeleteJudge = (judgeId) => {
    if (window.confirm("Are you sure you want to delete this judge?")) {
      onJudgesChange(judges.filter((j) => j.id !== judgeId));
    }
  };

  const handleAutoAssignTeams = () => {
    const softwareTeams = teams.filter(t => t.categoryId && t.categoryId.toLowerCase() === 'software');
    const hardwareTeams = teams.filter(t => t.categoryId && t.categoryId.toLowerCase() === 'hardware');

    const softwareJudges = judges.filter(j => j.category && j.category.toLowerCase() === 'software');
    const hardwareJudges = judges.filter(j => j.category && j.category.toLowerCase() === 'hardware');

    if (softwareJudges.length === 0 && hardwareJudges.length === 0) {
      alert('Please add judges with categories (Software/Hardware) first.');
      return;
    }

    const updatedJudges = judges.map(judge => {
      const clearedJudge = { ...judge, assignedTeams: [], assignedCategories: [] };
      return clearedJudge;
    });

    if (softwareJudges.length > 0) {
      const teamsPerJudge = Math.floor(softwareTeams.length / softwareJudges.length);
      const extraTeams = softwareTeams.length % softwareJudges.length;

      let teamIndex = 0;
      softwareJudges.forEach((judge, judgeIndex) => {
        const judgeInArray = updatedJudges.find(j => j.id === judge.id);
        if (judgeInArray) {
          const numTeams = teamsPerJudge + (judgeIndex < extraTeams ? 1 : 0);
          const assignedTeamIds = softwareTeams.slice(teamIndex, teamIndex + numTeams).map(t => t.id);
          const softwareCategoryIds = [...new Set(softwareTeams.map(t => t.categoryId))].filter(Boolean);

          judgeInArray.assignedTeams = assignedTeamIds;
          judgeInArray.assignedCategories = softwareCategoryIds;
          teamIndex += numTeams;
        }
      });
    }

    if (hardwareJudges.length > 0) {
      const teamsPerJudge = Math.floor(hardwareTeams.length / hardwareJudges.length);
      const extraTeams = hardwareTeams.length % hardwareJudges.length;

      let teamIndex = 0;
      hardwareJudges.forEach((judge, judgeIndex) => {
        const judgeInArray = updatedJudges.find(j => j.id === judge.id);
        if (judgeInArray) {
          const numTeams = teamsPerJudge + (judgeIndex < extraTeams ? 1 : 0);
          const assignedTeamIds = hardwareTeams.slice(teamIndex, teamIndex + numTeams).map(t => t.id);
          const hardwareCategoryIds = [...new Set(hardwareTeams.map(t => t.categoryId))].filter(Boolean);

          judgeInArray.assignedTeams = assignedTeamIds;
          judgeInArray.assignedCategories = hardwareCategoryIds;
          teamIndex += numTeams;
        }
      });
    }

    onJudgesChange(updatedJudges);
    alert('Teams have been automatically assigned to judges based on their categories!');
  };


  const softwareTeamsCount = teams.filter(t => t.categoryId && t.categoryId.toLowerCase() === 'software').length;
  const hardwareTeamsCount = teams.filter(t => t.categoryId && t.categoryId.toLowerCase() === 'hardware').length;
  const softwareJudgesCount = judges.filter(j => j.category && j.category.toLowerCase() === 'software').length;
  const hardwareJudgesCount = judges.filter(j => j.category && j.category.toLowerCase() === 'hardware').length;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddJudge}>
            Add Judge
          </Button>
          <Button
            variant="contained"
            onClick={handleAutoAssignTeams}
            disabled={judges.length === 0 || teams.length === 0}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              },
              '&:disabled': {
                background: '#d1d5db',
              }
            }}
          >
            Auto-Assign Teams
          </Button>
        </Box>
        <Box sx={{
          display: 'flex',
          gap: 3,
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          padding: '12px 20px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, mb: 0.5 }}>SOFTWARE</Box>
            <Box sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6' }}>
              {softwareTeamsCount} teams / {softwareJudgesCount} judges
            </Box>
          </Box>
          <Box sx={{ width: '1px', height: '40px', backgroundColor: '#cbd5e1' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, mb: 0.5 }}>HARDWARE</Box>
            <Box sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>
              {hardwareTeamsCount} teams / {hardwareJudgesCount} judges
            </Box>
          </Box>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
              }}
            >
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Judge Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Teams Assigned</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {judges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No judges added yet. Click "Add Judge" to get started.
                </TableCell>
              </TableRow>
            ) : (
              judges.map((judge) => {
                const assignedTeamCount = (judge.assignedTeams || []).length;

                return (
                  <TableRow
                    key={judge.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f8fafc"
                      }
                    }}
                  >
                    <TableCell sx={{ color: "#334155", fontWeight: 500 }}>{judge.name}</TableCell>
                    <TableCell sx={{ color: "#334155" }}>{judge.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={judge.category || "Not assigned"}
                        size="small"
                        color={judge.category ? "primary" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${assignedTeamCount} teams`}
                        size="small"
                        color={assignedTeamCount > 0 ? "primary" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      {judge.invitationSent ? (
                        <Chip label="Invited" size="small" color="success" />
                      ) : (
                        <Chip label="Pending" size="small" color="warning" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleAssignTeams(judge)}
                        sx={{
                          color: "#10b981",
                          "&:hover": {
                            backgroundColor: "#ecfdf5"
                          }
                        }}
                        title="Assign Teams"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleSendInvitation(judge)}
                        disabled={judge.invitationSent}
                        sx={{
                          color: judge.invitationSent ? "#9ca3af" : "#8b5cf6",
                          "&:hover": {
                            backgroundColor: "#faf5ff"
                          }
                        }}
                        title="Send Invitation"
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setCurrentJudge(judge);
                          setOpenDialog(true);
                        }}
                        sx={{
                          color: "#3b82f6",
                          "&:hover": {
                            backgroundColor: "#eff6ff"
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteJudge(judge.id)}
                        sx={{
                          color: "#ef4444",
                          "&:hover": {
                            backgroundColor: "#fef2f2"
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentJudge.id ? "Edit Judge" : "Add New Judge"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Judge Name"
            value={currentJudge.name}
            onChange={(e) => setCurrentJudge({ ...currentJudge, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Judge Email"
            type="email"
            value={currentJudge.email}
            onChange={(e) => setCurrentJudge({ ...currentJudge, email: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={currentJudge.category || ''}
              onChange={(e) => setCurrentJudge({ ...currentJudge, category: e.target.value })}
              label="Category"
            >
              <MenuItem value="Software">Software</MenuItem>
              <MenuItem value="Hardware">Hardware</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              textTransform: "none",
              color: "#7c3aed",
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: "10px",
              background: "rgba(124, 58, 237, 0.08)",
              "&:hover": {
                background: "rgba(124, 58, 237, 0.15)"
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveJudge}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              textTransform: "none",
              px: 4,
              py: 1.2,
              fontWeight: 700,
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(124, 58, 237, 0.25)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.35)"
              }
            }}
          >
            {currentJudge.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Assign Teams to {selectedJudge?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 2, p: 2, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Judge Category: <Chip label={selectedJudge?.category || 'Not set'} size="small" color="primary" sx={{ ml: 1 }} />
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
              Only teams in the same category will be available for assignment.
            </Typography>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Teams</InputLabel>
            <Select
              multiple
              value={selectedJudge?.assignedTeams || []}
              onChange={(e) => setSelectedJudge({ ...selectedJudge, assignedTeams: e.target.value })}
              input={<OutlinedInput label="Select Teams" />}
              renderValue={(selected) =>
                selected.map(id => teams.find(t => t.id === id)?.name).filter(Boolean).join(', ') || 'No teams selected'
              }
            >
              {teams
                .filter(team => {
                  if (!selectedJudge?.category || !team.categoryId) return false;
                  return team.categoryId.toLowerCase() === selectedJudge.category.toLowerCase();
                })
                .map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    <Checkbox checked={(selectedJudge?.assignedTeams || []).includes(team.id)} />
                    <ListItemText
                      primary={team.name}
                      secondary={`Project: ${team.projectTitle || 'N/A'}`}
                    />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {teams.filter(team => {
            if (!selectedJudge?.category || !team.categoryId) return false;
            return team.categoryId.toLowerCase() === selectedJudge.category.toLowerCase();
          }).length === 0 && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <Typography variant="body2" sx={{ color: '#dc2626' }}>
                No teams available in the {selectedJudge?.category} category. Please add teams in the Teams tab first.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAssignments} variant="contained">Save Assignments</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default JudgesTab;
