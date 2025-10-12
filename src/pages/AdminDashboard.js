import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

function AdminDashboard() {
  const { events, teams, judges, setEvents, setTeams, setJudges } = useApp();
  const [openEvent, setOpenEvent] = useState(false);
  const [openTeam, setOpenTeam] = useState(false);
  const [openJudge, setOpenJudge] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", description: "" });

  const handleAddEvent = () => {
    setEvents([...events, { id: Date.now(), ...newItem }]);
    setOpenEvent(false);
    setNewItem({ name: "", description: "" });
  };

  const handleAddTeam = () => {
    setTeams([...teams, { id: Date.now(), ...newItem }]);
    setOpenTeam(false);
    setNewItem({ name: "", description: "" });
  };

  const handleAddJudge = () => {
    setJudges([...judges, { id: Date.now(), ...newItem }]);
    setOpenJudge(false);
    setNewItem({ name: "", description: "" });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Events</Typography>
              <List>
                {events.map((event) => (
                  <ListItem key={event.id}>
                    <ListItemText primary={event.name} secondary={event.description} />
                  </ListItem>
                ))}
              </List>
              <Button variant="contained" onClick={() => setOpenEvent(true)}>
                Add Event
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Teams</Typography>
              <List>
                {teams.map((team) => (
                  <ListItem key={team.id}>
                    <ListItemText primary={team.name} secondary={team.description} />
                  </ListItem>
                ))}
              </List>
              <Button variant="contained" onClick={() => setOpenTeam(true)}>
                Add Team
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Judges</Typography>
              <List>
                {judges.map((judge) => (
                  <ListItem key={judge.id}>
                    <ListItemText primary={judge.name} secondary={judge.description} />
                  </ListItem>
                ))}
              </List>
              <Button variant="contained" onClick={() => setOpenJudge(true)}>
                Add Judge
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Event Dialog */}
      <Dialog open={openEvent} onClose={() => setOpenEvent(false)}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Event Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEvent(false)}>Cancel</Button>
          <Button onClick={handleAddEvent}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Add Team Dialog */}
      <Dialog open={openTeam} onClose={() => setOpenTeam(false)}>
        <DialogTitle>Add Team</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Team Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTeam(false)}>Cancel</Button>
          <Button onClick={handleAddTeam}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Add Judge Dialog */}
      <Dialog open={openJudge} onClose={() => setOpenJudge(false)}>
        <DialogTitle>Add Judge</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Judge Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJudge(false)}>Cancel</Button>
          <Button onClick={handleAddJudge}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDashboard;
