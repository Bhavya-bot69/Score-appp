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

function VenuesTab({ venues, onVenuesChange }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVenue, setCurrentVenue] = useState({
    name: "",
    capacity: 0,
    notes: "",
  });

  const handleAddVenue = () => {
    setCurrentVenue({ name: "", capacity: 0, notes: "" });
    setOpenDialog(true);
  };

  const handleSaveVenue = () => {
    if (!currentVenue.name) {
      alert("Venue name is required");
      return;
    }

    const newVenue = {
      id: currentVenue.id || Date.now(),
      name: currentVenue.name,
      capacity: currentVenue.capacity || 0,
      notes: currentVenue.notes || "",
      createdAt: currentVenue.createdAt || new Date().toISOString(),
    };

    let updatedVenues;
    if (currentVenue.id) {
      updatedVenues = venues.map((v) => (v.id === currentVenue.id ? newVenue : v));
    } else {
      updatedVenues = [...venues, newVenue];
    }

    onVenuesChange(updatedVenues);
    setOpenDialog(false);
  };

  const handleDeleteVenue = (venueId) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      onVenuesChange(venues.filter((v) => v.id !== venueId));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddVenue}>
          Add Venue
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
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Venue Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Capacity</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Notes</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No venues added yet. Click "Add Venue" to get started.
                </TableCell>
              </TableRow>
            ) : (
              venues.map((venue) => (
                <TableRow
                  key={venue.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc"
                    }
                  }}
                >
                  <TableCell sx={{ color: "#334155", fontWeight: 500 }}>{venue.name}</TableCell>
                  <TableCell sx={{ color: "#334155" }}>{venue.capacity}</TableCell>
                  <TableCell sx={{ color: "#334155" }}>{venue.notes}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCurrentVenue(venue);
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
                      onClick={() => handleDeleteVenue(venue.id)}
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
        <DialogTitle>{currentVenue.id ? "Edit Venue" : "Add New Venue"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Venue Name"
            value={currentVenue.name}
            onChange={(e) => setCurrentVenue({ ...currentVenue, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Capacity"
            type="number"
            value={currentVenue.capacity}
            onChange={(e) =>
              setCurrentVenue({ ...currentVenue, capacity: parseInt(e.target.value) || 0 })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Notes"
            value={currentVenue.notes}
            onChange={(e) => setCurrentVenue({ ...currentVenue, notes: e.target.value })}
            margin="normal"
            multiline
            rows={3}
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
            onClick={handleSaveVenue}
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
            {currentVenue.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VenuesTab;
