// src/components/RandomPieChart.jsx
import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function generateRandomPieData() {
  // Helper to get a random number from 1 to 100
  const rand = () => Math.floor(Math.random() * 100) + 1;

  return {
    labels: ["Category A", "Category B", "Category C", "Category D"],
    datasets: [
      {
        label: "Random Data",
        data: [rand(), rand(), rand(), rand()],
        backgroundColor: [
          "#FF6384", // Red
          "#36A2EB", // Blue
          "#FFCE56", // Yellow
          "#4CAF50", // Green
        ],
      },
    ],
  };
}

export default function RandomPieChart() {
  const [data, setData] = useState(generateRandomPieData());

  const refreshData = () => {
    setData(generateRandomPieData());
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-72 h-72">
        <Pie data={data} />
      </div>
      <button
        onClick={refreshData}
        className="mt-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Refresh
      </button>
    </div>
  );
}
