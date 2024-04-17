import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './Hotjar.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DataForm = () => {
  const [surveyData, setSurveyData] = useState({
    satisfaction: '',
    usability: '',
    performance: '',
  });

  const [chartData, setChartData] = useState({
    labels: ['Satisfaction', 'Usability', 'Performance'],
    datasets: [
      {
        label: 'Survey Results',
        data: [],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurveyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const choice = window.prompt("Which attribute do you want to visualize? (Enter 'satisfaction', 'usability', or 'performance')");

    // Validate choice and update graph
    if (choice && ['satisfaction', 'usability', 'performance'].includes(choice.toLowerCase())) {
      const newData = { ...chartData };
      newData.datasets[0].data = [
        choice === 'satisfaction' ? surveyData.satisfaction : 0,
        choice === 'usability' ? surveyData.usability : 0,
        choice === 'performance' ? surveyData.performance : 0,
      ];
      setChartData(newData);
    } else {
      alert("Invalid choice. Please enter 'satisfaction', 'usability', or 'performance'.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Satisfaction (1-10): </label>
          <input
            type="number"
            name="satisfaction"
            value={surveyData.satisfaction}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Usability (1-10): </label>
          <input
            type="number"
            name="usability"
            value={surveyData.usability}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Performance (1-10): </label>
          <input
            type="number"
            name="performance"
            value={surveyData.performance}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Graph</h2>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default DataForm;
