import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import Navigation from "../components/Navigation";

function EventList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const saveEvents = (updatedEvents) => {
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const handleCreateEvent = () => {
    setCurrentEvent({ name: "", description: "", startDate: "", endDate: "" });
    setOpenDialog(true);
  };

  const handleSaveEvent = () => {
    if (!currentEvent.name) {
      alert("Event name is required");
      return;
    }

    const newEvent = {
      id: currentEvent.id || Date.now(),
      name: currentEvent.name,
      description: currentEvent.description,
      startDate: currentEvent.startDate,
      endDate: currentEvent.endDate,
      status: "DRAFT",
      createdAt: currentEvent.createdAt || new Date().toISOString(),
    };

    let updatedEvents;
    if (currentEvent.id) {
      updatedEvents = events.map((e) => (e.id === currentEvent.id ? newEvent : e));
    } else {
      updatedEvents = [...events, newEvent];
    }

    saveEvents(updatedEvents);
    setOpenDialog(false);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter((e) => e.id !== eventId);
      saveEvents(updatedEvents);
    }
  };

  const handleManageEvent = (eventId) => {
    navigate(`/admin/event/${eventId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)" }}>
      <Navigation />

      <Box sx={{ maxWidth: "1400px", mx: "auto", px: 4, py: 8 }}>
        <Box sx={{ mb: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1.5,
                fontSize: "2.75rem"
              }}
            >
              My Events
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontSize: "1.15rem",
                fontWeight: 500
              }}
            >
              Manage your hackathons and competitions
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleCreateEvent}
            sx={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              color: "white",
              textTransform: "none",
              px: 4,
              py: 1.75,
              fontSize: "1.05rem",
              fontWeight: 600,
              borderRadius: "12px",
              boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(124, 58, 237, 0.4)"
              }
            }}
          >
            + Create Event
          </Button>
        </Box>

        {events.length === 0 ? (
          <Card
            sx={{
              p: 10,
              textAlign: "center",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
              border: "1px solid rgba(124, 58, 237, 0.1)"
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#1e293b",
                fontWeight: 700,
                mb: 2
              }}
            >
              No Events Yet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                mb: 5,
                fontSize: "1.1rem",
                maxWidth: "500px",
                mx: "auto"
              }}
            >
              Create your first event to get started with fair, automated judging
            </Typography>
            <Button
              variant="contained"
              onClick={handleCreateEvent}
              sx={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                color: "white",
                textTransform: "none",
                px: 5,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: "12px",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(124, 58, 237, 0.4)"
                }
              }}
            >
              Create Your First Event
            </Button>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {events.map((event) => (
              <Card
                key={event.id}
                sx={{
                  width: "360px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #ffffff 0%, #fefefe 100%)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(124, 58, 237, 0.1)",
                  "&:hover": {
                    boxShadow: "0 12px 35px rgba(124, 58, 237, 0.2)",
                    transform: "translateY(-4px)",
                    borderColor: "rgba(124, 58, 237, 0.3)"
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#1e293b",
                        fontSize: "1.4rem"
                      }}
                    >
                      {event.name}
                    </Typography>
                    <Chip
                      label={event.status}
                      size="small"
                      sx={{
                        background: "linear-gradient(135deg, #ddd6fe 0%, #e0e7ff 100%)",
                        color: "#5b21b6",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        height: "26px",
                        px: 1
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        mb: 0.5
                      }}
                    >
                      <strong style={{ color: "#475569" }}>Start:</strong> {formatDate(event.startDate)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        fontSize: "0.95rem"
                      }}
                    >
                      <strong style={{ color: "#475569" }}>End:</strong> {formatDate(event.endDate)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleManageEvent(event.id)}
                      sx={{
                        background: "#3b82f6",
                        color: "white",
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: "10px",
                        py: 1.3,
                        fontSize: "0.95rem",
                        boxShadow: "0 2px 8px rgba(59, 130, 246, 0.25)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "#2563eb",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.35)"
                        }
                      }}
                    >
                      Manage Event
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleDeleteEvent(event.id)}
                      sx={{
                        background: "#ef4444",
                        color: "white",
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: "10px",
                        px: 3,
                        py: 1.3,
                        minWidth: "auto",
                        boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "#dc2626",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.35)"
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              p: 1,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.75rem", color: "#1e293b" }}>
            {currentEvent.id ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Event Name"
              value={currentEvent.name}
              onChange={(e) => setCurrentEvent({ ...currentEvent, name: e.target.value })}
              margin="normal"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#7c3aed",
                    borderWidth: "2px"
                  }
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#7c3aed"
                }
              }}
            />
            <TextField
              fullWidth
              label="Event Description"
              value={currentEvent.description}
              onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#7c3aed",
                    borderWidth: "2px"
                  }
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#7c3aed"
                }
              }}
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={currentEvent.startDate}
              onChange={(e) => setCurrentEvent({ ...currentEvent, startDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#7c3aed",
                    borderWidth: "2px"
                  }
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#7c3aed"
                }
              }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={currentEvent.endDate}
              onChange={(e) => setCurrentEvent({ ...currentEvent, endDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&.Mui-focused fieldset": {
                    borderColor: "#7c3aed",
                    borderWidth: "2px"
                  }
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#7c3aed"
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{
                textTransform: "none",
                color: "#64748b",
                fontWeight: 600,
                px: 3,
                py: 1.2,
                borderRadius: "10px",
                "&:hover": {
                  background: "#f1f5f9"
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEvent}
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
              {currentEvent.id ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default EventList;
