import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import AnalyticsPanel from "../components/AnalyticsPanel";

function ResultsPage() {
  const { evaluations, categories } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("total");
  const [sortOrder, setSortOrder] = useState("desc");

  // Aggregate scores by team
  const aggregatedScores = useMemo(() => {
    const agg = {};
    evaluations.forEach((evaluation) => {
      if (!agg[evaluation.teamId]) {
        agg[evaluation.teamId] = { team: evaluation.team, scores: {}, count: 0, total: 0 };
      }
      agg[evaluation.teamId].count += 1;
      categories.forEach((cat) => {
        if (!agg[evaluation.teamId].scores[cat.name]) {
          agg[evaluation.teamId].scores[cat.name] = 0;
        }
        agg[evaluation.teamId].scores[cat.name] += Number(evaluation.scores[cat.id] || 0);
      });
      agg[evaluation.teamId].total += evaluation.total;
    });

    // Average scores
    Object.keys(agg).forEach((teamId) => {
      categories.forEach((cat) => {
        agg[teamId].scores[cat.name] /= agg[teamId].count;
      });
      agg[teamId].total /= agg[teamId].count;
    });

    return Object.values(agg);
  }, [evaluations, categories]);

  // Filter and sort
  const filteredScores = useMemo(() => {
    let filtered = aggregatedScores.filter((score) =>
      score.team.toLowerCase().includes(searchTerm.toLowerCase())
    );
    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    return filtered;
  }, [aggregatedScores, searchTerm, sortBy, sortOrder]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Results Dashboard
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search Team"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="total">Total</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "Asc" : "Desc"}
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Team</TableCell>
              {categories.map((cat) => (
                <TableCell key={cat.id}>{cat.name}</TableCell>
              ))}
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredScores.map((score, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{score.team}</TableCell>
                {categories.map((cat) => (
                  <TableCell key={cat.id}>{score.scores[cat.name]?.toFixed(2)}</TableCell>
                ))}
                <TableCell>{score.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AnalyticsPanel scores={filteredScores} />
    </Box>
  );
}

export default ResultsPage;
