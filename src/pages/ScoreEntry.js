import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

function ScoreEntry() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const config = JSON.parse(localStorage.getItem("config")) || { numTeams: 4, scoringMethod: "points", numJudges: 4 };
  const [judge, setJudge] = useState("Judge 1");
  const [numJudges, setNumJudges] = useState(config.numJudges);
  const [scoringMethod, setScoringMethod] = useState(config.scoringMethod);

  // Generate teams dynamically based on config.numTeams
  const teams = Array.from({ length: config.numTeams }, (_, i) => `Team ${String.fromCharCode(65 + i)}`);

  // State to store scores for all teams
  const [teamScores, setTeamScores] = useState(
    teams.map((team) => ({ team, score: "" }))
  );

  useEffect(() => {
    // Reset team scores if number of teams changes
    setTeamScores(teams.map((team) => ({ team, score: "" })));
  }, [config.numTeams]);

  // Update score for a specific team
  const handleChange = (index, value) => {
    const updatedScores = [...teamScores];
    updatedScores[index].score = value;
    setTeamScores(updatedScores);
  };

  const handleSubmitAll = () => {
    // Validation
    for (let score of teamScores) {
      if (!score.score) {
        alert("Please fill all scores for all teams.");
        return;
      }
    }

    const allScores = JSON.parse(localStorage.getItem("scoreData")) || [];

    teamScores.forEach((teamScore) => {
      let total = 0;
      if (scoringMethod === "points") {
        total = Number(teamScore.score);
      } else if (scoringMethod === "percentage") {
        total = Number(teamScore.score); // Assuming percentage is entered as number 0-100
      } else if (scoringMethod === "grades") {
        // Convert grades to points (example: A=4, B=3, C=2, D=1, F=0)
        const gradeMap = { A: 4, B: 3, C: 2, D: 1, F: 0 };
        total = gradeMap[teamScore.score.toUpperCase()] || 0;
      }

      allScores.push({
        judge,
        team: teamScore.team,
        score: teamScore.score,
        total,
        percentage: scoringMethod === "percentage" ? total : null,
        grade: scoringMethod === "grades" ? teamScore.score.toUpperCase() : null,
      });
    });

    localStorage.setItem("scoreData", JSON.stringify(allScores));
    navigate("/results");
  };

  return (
    <div className="page-container" style={{ background: theme.background, color: theme.color }}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Score Entry - Multiple Teams
      </motion.h2>

      {/* Judge Selector */}
      <motion.label
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Judge:
      </motion.label>
      <motion.select
        value={judge}
        onChange={(e) => setJudge(e.target.value)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {Array.from({ length: numJudges }, (_, i) => (
          <option key={i}>Judge {i + 1}</option>
        ))}
      </motion.select>

      <motion.div
        className="score-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {teamScores.map((teamScore, index) => (
          <motion.div
            key={index}
            className="score-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}
            style={{ background: theme.cardBackground }}
          >
            <h4>{teamScore.team}</h4>
            {scoringMethod === "grades" ? (
              <motion.select
                value={teamScore.score}
                onChange={(e) => handleChange(index, e.target.value)}
                whileFocus={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <option value="">Select Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </motion.select>
            ) : (
              <motion.input
                type="number"
                placeholder={scoringMethod === "percentage" ? "Score (%)" : "Score"}
                value={teamScore.score}
                onChange={(e) => handleChange(index, e.target.value)}
                whileFocus={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                min={0}
                max={scoringMethod === "percentage" ? 100 : undefined}
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        onClick={handleSubmitAll}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05, backgroundColor: theme.buttonBackground }}
        whileTap={{ scale: 0.95 }}
        style={{ background: theme.buttonBackground, color: theme.buttonColor }}
      >
        Submit All Scores
      </motion.button>
    </div>
  );
}

export default ScoreEntry;

