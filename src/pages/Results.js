import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { ThemeContext } from "../context/ThemeContext";
import AnalyticsPanel from "../components/AnalyticsPanel";
import Confetti from "react-confetti";
import { Tooltip, TooltipProvider } from "react-tooltip";

function Results() {
  const { theme } = useContext(ThemeContext);
  const [scores, setScores] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const navigate = useNavigate();

  const scoresPerPage = 5;

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("scoreData")) || [];
    setScores(data);
  }, []);

  // Filter scores by judge and search term
  const filteredScores = useMemo(() => {
    let filtered = selectedJudge === "All" ? scores : scores.filter((s) => s.judge === selectedJudge);
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.judge.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.total.toString().includes(searchTerm)
      );
    }
    return filtered.sort((a, b) => b.total - a.total);
  }, [scores, selectedJudge, searchTerm]);

  // Pagination
  const pageCount = Math.ceil(filteredScores.length / scoresPerPage);
  const displayScores = filteredScores.slice(pageNumber * scoresPerPage, (pageNumber + 1) * scoresPerPage);

  // Percentile
  const calculatePercentile = (score, allScores) => {
    const lessEqual = allScores.filter((s) => s.total <= score).length;
    return ((lessEqual / allScores.length) * 100).toFixed(2);
  };

  // Z-Score
  const calculateMean = (arr) => arr.reduce((acc, curr) => acc + Number(curr.total), 0) / arr.length;
  const calculateStdDev = (arr, mean) =>
    Math.sqrt(arr.reduce((acc, curr) => acc + Math.pow(curr.total - mean, 2), 0) / arr.length);
  const calculateZScore = (score, mean, stdDev) => (stdDev === 0 ? 0 : ((score - mean) / stdDev).toFixed(2));

  const handleLogout = () => {
    localStorage.removeItem("scoreData");
    navigate("/");
  };

  // Editable score handlers
  const handleEdit = (index, field) => {
    setEditingIndex(index);
    setEditingField(field);
  };

  const handleChange = (index, field, value) => {
    const updatedScores = [...scores];
    const scoreIndex = scores.findIndex((s) => s === displayScores[index]);
    if (scoreIndex !== -1) {
      updatedScores[scoreIndex][field] = value;
      // Recalculate total and percentage
      const { idea, ppt, execution, teamwork } = updatedScores[scoreIndex];
      const total = Number(idea) + Number(ppt) + Number(execution) + Number(teamwork);
      updatedScores[scoreIndex].total = total;
      updatedScores[scoreIndex].percentage = total;
      setScores(updatedScores);
      localStorage.setItem("scoreData", JSON.stringify(updatedScores));
    }
  };

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  if (filteredScores.length === 0)
    return <p className="page-container" style={{ background: theme.background, color: theme.color }}>No scores submitted yet!</p>;

  const mean = calculateMean(filteredScores);
  const stdDev = calculateStdDev(filteredScores, mean);

  return (
    <TooltipProvider>
      <div className="page-container" style={{ background: theme.background, color: theme.color }}>
        <h1>Results Dashboard</h1>

        {/* Judge Filter */}
        <label>Select Judge: </label>
        <select value={selectedJudge} onChange={(e) => setSelectedJudge(e.target.value)}>
          <option>All</option>
          <option>Judge 1</option>
          <option>Judge 2</option>
          <option>Judge 3</option>
          <option>Judge 4</option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by team, judge, or score"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Judge</th>
              <th>Team</th>
              <th>Idea</th>
              <th>PPT</th>
              <th>Execution</th>
              <th>Teamwork</th>
              <th>Total</th>
              <th>Percentile</th>
              <th>Z-Score</th>
            </tr>
          </thead>
          <tbody>
            {displayScores.map((score, index) => (
              <tr key={index} className={index < 3 ? "top-score" : ""} data-tooltip-id={`tooltip-${index}`}>
                <td>{pageNumber * scoresPerPage + index + 1}</td>
                <td>{score.judge}</td>
                <td>{score.team}</td>
                {["idea", "ppt", "execution", "teamwork"].map((field) => (
                  <td
                    key={field}
                    onClick={() => handleEdit(index, field)}
                    style={{ cursor: "pointer", position: "relative" }}
                  >
                    {editingIndex === index && editingField === field ? (
                      <input
                        type="number"
                        value={score[field]}
                        onChange={(e) => handleChange(index, field, e.target.value)}
                        onBlur={() => {
                          setEditingIndex(null);
                          setEditingField(null);
                        }}
                        autoFocus
                        style={{ width: "60px" }}
                      />
                    ) : (
                      score[field]
                    )}
                  </td>
                ))}
                <td className="score-number">{score.total}</td>
                <td>{calculatePercentile(score.total, filteredScores)}%</td>
                <td>{calculateZScore(score.total, mean, stdDev)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
        />

        <AnalyticsPanel scores={filteredScores} />

        {/* Confetti for top 3 */}
        {filteredScores.length > 0 && (
          <Confetti
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
            run={true}
            tweenDuration={3000}
            initialVelocityX={{ min: -10, max: 10 }}
            initialVelocityY={{ min: -10, max: 0 }}
          />
        )}

        <button onClick={handleLogout} style={{ marginTop: "20px" }}>
          Logout
        </button>
      </div>
      {displayScores.map((score, index) => (
        <Tooltip key={index} id={`tooltip-${index}`} place="top">
          <span>Judge: {score.judge}, Team: {score.team}</span>
        </Tooltip>
      ))}
    </TooltipProvider>
  );
}

export default Results;
