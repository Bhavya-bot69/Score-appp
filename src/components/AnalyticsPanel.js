import React from "react";
import { BarChart, PieChart, RadarChart } from "./ChartComponent";

export default function AnalyticsPanel({ scores }) {
  const totalScores = scores.map((s) => s.total);
  const mean = totalScores.reduce((a, b) => a + b, 0) / totalScores.length;
  const max = Math.max(...totalScores);
  const min = Math.min(...totalScores);

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Analytics</h3>
      <p>Mean Score: {mean.toFixed(2)}</p>
      <p>Max Score: {max}</p>
      <p>Min Score: {min}</p>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ width: "300px", margin: "10px" }}>
          <BarChart data={scores} />
        </div>
        <div style={{ width: "300px", margin: "10px" }}>
          <PieChart data={scores} />
        </div>
        <div style={{ width: "300px", margin: "10px" }}>
          <RadarChart data={scores} />
        </div>
      </div>
    </div>
  );
}
