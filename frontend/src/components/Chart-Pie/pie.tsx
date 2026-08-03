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
  if (!data) return <p className="text-center text-[#F8FAFC]/50 py-4">Select a bar to view tag breakdown</p>;

  const tagCount: Record<string, number> = {};
  data.problems.forEach((problem) => {
    problem.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  const pieData = {
    labels: Object.keys(tagCount),
    datasets: [
      {
        label: 'Problem Tags Distribution',
        data: Object.values(tagCount),
        backgroundColor: [
          '#3B82F6', '#2563EB', '#60A5FA', '#93C5FD',
          '#1D4ED8', '#38BDF8', '#0284C7', '#0EA5E9'
        ],
        borderColor: '#131B2E',
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#F8FAFC',
          font: { family: 'Inter, sans-serif' }
        }
      }
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto py-4 text-center">
      <h4 className="text-sm font-semibold text-[#F8FAFC] mb-3">
        {data.name}'s Tag Distribution
      </h4>
      <Pie data={pieData} options={pieOptions} />
    </div>
  );
};