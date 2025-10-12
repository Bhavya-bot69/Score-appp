import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Box, Typography, TextField, Button, Grid, Card, CardContent } from "@mui/material";

function JudgeInterface() {
  const { user, teams, categories, evaluations, setEvaluations } = useApp();
  const navigate = useNavigate();

  const [scores, setScores] = useState(
    teams.reduce((acc, team) => {
      acc[team.id] = categories.reduce((catAcc, cat) => {
        catAcc[cat.id] = "";
        return catAcc;
      }, {});
      return acc;
    }, {})
  );

  const handleScoreChange = (teamId, categoryId, value) => {
    setScores({
      ...scores,
      [teamId]: {
        ...scores[teamId],
        [categoryId]: value,
      },
    });
  };

  const handleSubmit = () => {
    // Validation
    for (const teamId in scores) {
      for (const categoryId in scores[teamId]) {
        if (!scores[teamId][categoryId]) {
          alert("Please fill all scores.");
          return;
        }
      }
    }

    // Calculate total
    const newEvaluations = [];
    teams.forEach((team) => {
      let total = 0;
      categories.forEach((cat) => {
        total += Number(scores[team.id][cat.id]) * cat.weight;
      });
      newEvaluations.push({
        id: Date.now() + Math.random(),
        judge: user.username,
        team: team.name,
        teamId: team.id,
        scores: scores[team.id],
        total,
      });
    });

    setEvaluations([...evaluations, ...newEvaluations]);
    navigate("/results");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Judge Interface - {user?.username}
      </Typography>
      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} md={6} key={team.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{team.name}</Typography>
                {categories.map((category) => (
                  <TextField
                    key={category.id}
                    fullWidth
                    label={category.name}
                    type="number"
                    value={scores[team.id][category.id]}
                    onChange={(e) => handleScoreChange(team.id, category.id, e.target.value)}
                    margin="normal"
                    inputProps={{ min: 0, max: 10 }}
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }}>
        Submit Scores
      </Button>
    </Box>
  );
}

export default JudgeInterface;
