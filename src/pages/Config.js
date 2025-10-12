import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Config() {
  const navigate = useNavigate();

  const [numTeams, setNumTeams] = useState(4);
  const [scoringMethod, setScoringMethod] = useState("points");
  const [numJudges, setNumJudges] = useState(4);

  const handleSubmit = () => {
    // Save config to localStorage or context
    localStorage.setItem("config", JSON.stringify({ numTeams, scoringMethod, numJudges }));
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="page-container">
      <h2>Configuration</h2>

      <label>
        Number of Teams:
        <input
          type="number"
          min="1"
          max="20"
          value={numTeams}
          onChange={(e) => setNumTeams(Number(e.target.value))}
        />
      </label>

      <label>
        Scoring Method:
        <select value={scoringMethod} onChange={(e) => setScoringMethod(e.target.value)}>
          <option value="points">Points</option>
          <option value="percentage">Percentage</option>
          <option value="grades">Grades</option>
        </select>
      </label>

      <label>
        Number of Judges:
        <input
          type="number"
          min="1"
          max="10"
          value={numJudges}
          onChange={(e) => setNumJudges(Number(e.target.value))}
        />
      </label>

      <button onClick={handleSubmit}>Save Configuration</button>
    </div>
  );
}

export default Config;
