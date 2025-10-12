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
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { eventService } from "../../services/eventService";

function CriteriaTab({ categories, onCategoriesChange, eventId }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCriterion, setCurrentCriterion] = useState({
    name: "",
    maxMarks: 100,
  });

  const handleAddCriterion = () => {
    setCurrentCriterion({ name: "", maxMarks: 100 });
    setOpenDialog(true);
  };

  const handleSaveCriterion = async () => {
    if (!currentCriterion.name) {
      alert("Criterion name is required");
      return;
    }

    if (!currentCriterion.maxMarks || currentCriterion.maxMarks <= 0) {
      alert("Max marks must be greater than 0");
      return;
    }

    try {
      const criterionData = {
        event_id: eventId,
        name: currentCriterion.name,
        max_score: currentCriterion.maxMarks || 100,
      };

      if (currentCriterion.id) {
        // Update existing criterion
        await eventService.updateCriterion(currentCriterion.id, criterionData);
      } else {
        // Create new criterion
        await eventService.createCriterion(criterionData);
      }

      // Reload criteria from database
      const updatedCriteria = await eventService.getCriteriaByEvent(eventId);
      const mappedCriteria = updatedCriteria.map(c => ({
        id: c.id,
        name: c.name,
        maxMarks: c.max_score,
        createdAt: c.created_at
      }));
      onCategoriesChange(mappedCriteria);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving criterion:', error);
      alert('Failed to save criterion. Please try again.');
    }
  };

  const handleDeleteCriterion = async (criterionId) => {
    if (window.confirm("Are you sure you want to delete this criterion?")) {
      try {
        await eventService.deleteCriterion(criterionId);

        // Reload criteria from database
        const updatedCriteria = await eventService.getCriteriaByEvent(eventId);
        const mappedCriteria = updatedCriteria.map(c => ({
          id: c.id,
          name: c.name,
          maxMarks: c.max_score,
          createdAt: c.created_at
        }));
        onCategoriesChange(mappedCriteria);
      } catch (error) {
        console.error('Error deleting criterion:', error);
        alert('Failed to delete criterion. Please try again.');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
            Scoring Criteria
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Define the criteria judges will use to evaluate teams
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddCriterion}>
          Add Criterion
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
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Criterion Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Max Marks</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                    No scoring criteria added yet.
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    Click "Add Criterion" to define evaluation criteria (e.g., PPT: 50 marks, Prototype: 50 marks)
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((criterion) => (
                <TableRow
                  key={criterion.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc"
                    }
                  }}
                >
                  <TableCell sx={{ color: "#334155", fontWeight: 500 }}>{criterion.name}</TableCell>
                  <TableCell sx={{ color: "#334155", fontWeight: 600 }}>{criterion.maxMarks}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCurrentCriterion(criterion);
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
                      onClick={() => handleDeleteCriterion(criterion.id)}
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
        <DialogTitle>{currentCriterion.id ? "Edit Criterion" : "Add New Criterion"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 2, mt: 1 }}>
            Define a scoring criterion that judges will use to evaluate teams. For example: "PPT" with 50 marks, "Prototype" with 50 marks.
          </Typography>
          <TextField
            fullWidth
            label="Criterion Name"
            value={currentCriterion.name}
            onChange={(e) => setCurrentCriterion({ ...currentCriterion, name: e.target.value })}
            margin="normal"
            required
            placeholder="e.g., PPT, Prototype, Innovation"
          />
          <TextField
            fullWidth
            label="Max Marks"
            type="number"
            value={currentCriterion.maxMarks}
            onChange={(e) =>
              setCurrentCriterion({ ...currentCriterion, maxMarks: parseInt(e.target.value) || 0 })
            }
            margin="normal"
            required
            inputProps={{ min: 1 }}
            helperText="Enter the maximum marks for this criterion"
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
            onClick={handleSaveCriterion}
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
            {currentCriterion.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CriteriaTab;
