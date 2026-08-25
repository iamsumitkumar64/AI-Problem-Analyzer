import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProblemInterface {
  tags: string[];
  english: string;
  hindi: string;
  _id: string;
}

interface DataInterface {
  mobileNo: number;
  name: string;
  numberOfProblems: number;
  wardNo: string;
  problems: ProblemInterface[];
  _id: string;
}

interface PieCompProps {
  data?: DataInterface;
}

export const Pie_Comp: React.FC<PieCompProps> = ({ data }) => {
  if (!data) return <p className="text-center text-zinc-500 py-4">Select a bar to view tag breakdown</p>;

  const tagCount: Record<string, number> = {};
  (data.problems || []).forEach((problem) => {
    (problem.tags || []).forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  const pieData = {
    labels: Object.keys(tagCount),
    datasets: [
      {
        label: 'Issues Count',
        data: Object.values(tagCount),
        backgroundColor: [
          '#FFFFFF', '#D4D4D8', '#A1A1AA', '#71717A',
          '#52525B', '#3F3F46', '#27272A', '#E4E4E7'
        ],
        borderColor: '#121214',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#A1A1AA',
          font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 11 },
          padding: 12,
        }
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto py-2 text-center">
      <Pie data={pieData} options={pieOptions} />
    </div>
  );
};