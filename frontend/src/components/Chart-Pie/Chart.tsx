import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    type ChartEvent,
} from 'chart.js';
import { Pie_Comp } from './pie';
import { Modal } from 'antd';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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

interface CommonProblemProps {
    datas: DataInterface[] | null;
}

const ChartANalyse: React.FC<CommonProblemProps> = ({ datas }) => {
    const [pieData, setPieData] = useState<DataInterface>();
    const [ModalOpen, setModalOpen] = useState<boolean>();

    if (!datas || datas.length === 0) {
        return <p className="text-slate-500 text-center py-8">No visual data available.</p>;
    }

    const chartData = {
        labels: datas.map((item) => item.name),
        datasets: [
            {
                label: 'Identified Issues Count',
                data: datas.map((item) => item.numberOfProblems || (item.problems ? item.problems.length : 1)),
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                borderColor: '#FFFFFF',
                borderWidth: 1.5,
                borderRadius: 6,
                hoverBackgroundColor: '#FFFFFF',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    color: '#A1A1AA',
                    font: {
                        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        size: 12
                    }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#18181B',
                titleColor: '#FAFAFA',
                bodyColor: '#E4E4E7',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                ticks: { color: '#A1A1AA', maxRotation: 45, minRotation: 20 },
                grid: { color: 'rgba(255, 255, 255, 0.04)' },
            },
            y: {
                beginAtZero: true,
                ticks: { color: '#A1A1AA', stepSize: 1 },
                grid: { color: 'rgba(255, 255, 255, 0.04)' },
            },
        },
        onClick: (_event: ChartEvent, elements: any) => {
            if (elements && elements.length > 0) {
                const index = elements[0].index;
                const clickedData = datas[index];
                setPieData(clickedData);
                setModalOpen(true);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                        Citizen Petition Frequency Matrix
                    </h3>
                    <p className="text-xs text-zinc-400">
                        Click on any citizen's bar column to inspect their tag distribution breakdown
                    </p>
                </div>
            </div>

            <div className="p-4 bg-[#09090B] border border-white/[0.08] rounded-2xl shadow-inner">
                <Bar data={chartData} options={chartOptions} />
            </div>

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-base">Sector Analysis: {pieData?.name}</span>
                    </div>
                }
                open={ModalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={480}
            >
                <Pie_Comp data={pieData} />
            </Modal>
        </div>
    );
};

export default ChartANalyse;