import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PriceChart = ({ marketData }) => {
  const chartData = {
    labels: marketData.map(data => {
      const date = new Date(data.timestamp);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Price',
        data: marketData.map(data => data.close),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price History'
      }
    }
  };
  
  return <Line data={chartData} options={options} />;
};

export default PriceChart;

