import React from "react";
import { Bar, Pie, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export function BarChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.team),
    datasets: [
      {
        label: "Total Score",
        data: data.map((d) => d.total),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return <Bar data={chartData} options={{ responsive: true, animation: { duration: 1000 } }} />;
}

export function PieChart({ data }) {
  // Group by judge and sum totals
  const judgeTotals = data.reduce((acc, cur) => {
    acc[cur.judge] = (acc[cur.judge] || 0) + cur.total;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(judgeTotals),
    datasets: [
      {
        label: "Judge Score Distribution",
        data: Object.values(judgeTotals),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
        ],
      },
    ],
  };

  return <Pie data={chartData} options={{ responsive: true, animation: { duration: 1000 } }} />;
}

export function RadarChart({ data }) {
  // Average scores per category
  const categories = ["idea", "ppt", "execution", "teamwork"];
  const averages = categories.map((cat) => {
    const total = data.reduce((acc, cur) => acc + Number(cur[cat]), 0);
    return data.length ? total / data.length : 0;
  });

  const chartData = {
    labels: categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [
      {
        label: "Average Scores",
        data: averages,
        backgroundColor: "rgba(179,181,198,0.2)",
        borderColor: "rgba(179,181,198,1)",
        pointBackgroundColor: "rgba(179,181,198,1)",
      },
    ],
  };

  return <Radar data={chartData} options={{ responsive: true, animation: { duration: 1000 } }} />;
}
