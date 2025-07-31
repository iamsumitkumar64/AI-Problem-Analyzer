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
  if (!data) return <p style={{ textAlign: 'center' }}>Click on a bar to see pie chart of that user</p>;

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
          '#F87171', '#60A5FA', '#FCD34D', '#34D399',
          '#F87171', '#60A5FA', '#FCD34D', '#34D399',
          '#C084FC', '#F472B6', '#38BDF8', '#A78BFA'
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '50%', margin: '2rem auto' }}>
      <h3 style={{ textAlign: 'center' }}>{data.name}'s Problem Tag Distribution</h3>
      <Pie data={pieData} />
    </div>
  );
};