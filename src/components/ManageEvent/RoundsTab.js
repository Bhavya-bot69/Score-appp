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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

function RoundsTab({ rounds, onRoundsChange }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRound, setCurrentRound] = useState({
    name: "",
    order: 1,
  });

  const handleAddRound = () => {
    setCurrentRound({ name: "", order: rounds.length + 1 });
    setOpenDialog(true);
  };

  const handleSaveRound = () => {
    if (!currentRound.name) {
      alert("Round name is required");
      return;
    }

    const newRound = {
      id: currentRound.id || Date.now(),
      name: currentRound.name,
      order: currentRound.order || 1,
      createdAt: currentRound.createdAt || new Date().toISOString(),
    };

    let updatedRounds;
    if (currentRound.id) {
      updatedRounds = rounds.map((r) => (r.id === currentRound.id ? newRound : r));
    } else {
      updatedRounds = [...rounds, newRound];
    }

    updatedRounds.sort((a, b) => a.order - b.order);
    onRoundsChange(updatedRounds);
    setOpenDialog(false);
  };

  const handleDeleteRound = (roundId) => {
    if (window.confirm("Are you sure you want to delete this round?")) {
      onRoundsChange(rounds.filter((r) => r.id !== roundId));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRound}>
          Create Round
        </Button>
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
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Round Name</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rounds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No rounds created yet. Click "Create Round" to get started.
                </TableCell>
              </TableRow>
            ) : (
              rounds.map((round) => (
                <TableRow
                  key={round.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc"
                    }
                  }}
                >
                  <TableCell sx={{ color: "#334155", fontWeight: 600 }}>{round.order}</TableCell>
                  <TableCell sx={{ color: "#334155", fontWeight: 500 }}>{round.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCurrentRound(round);
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
                      onClick={() => handleDeleteRound(round.id)}
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentRound.id ? "Edit Round" : "Create New Round"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Round Name"
            value={currentRound.name}
            onChange={(e) => setCurrentRound({ ...currentRound, name: e.target.value })}
            margin="normal"
            required
            placeholder="e.g., Round 1, Semi-Finals, Finals"
          />
          <TextField
            fullWidth
            label="Order"
            type="number"
            value={currentRound.order}
            onChange={(e) => setCurrentRound({ ...currentRound, order: parseInt(e.target.value) })}
            margin="normal"
            required
          />
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
            onClick={handleSaveRound}
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
            {currentRound.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RoundsTab;
