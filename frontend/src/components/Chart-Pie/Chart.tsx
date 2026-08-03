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
        return <p className="text-[#F8FAFC]/50 text-center py-6">No data available</p>;
    }

    const chartData = {
        labels: datas.map((item) => item.name),
        datasets: [
            {
                label: 'No. of Problems',
                data: datas.map((item) => item.numberOfProblems),
                backgroundColor: 'rgba(59, 130, 246, 0.75)',
                borderColor: '#3B82F6',
                borderWidth: 1.5,
                borderRadius: 6,
                hoverBackgroundColor: '#2563EB',
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
                    color: '#F8FAFC',
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#131B2E',
                titleColor: '#F8FAFC',
                bodyColor: '#F8FAFC',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                ticks: { color: '#F8FAFC' },
                grid: { color: 'rgba(248, 250, 252, 0.08)' },
            },
            y: {
                beginAtZero: true,
                ticks: { color: '#F8FAFC', stepSize: 1 },
                grid: { color: 'rgba(248, 250, 252, 0.08)' },
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

    const onClose = () => {
        setModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-center font-semibold text-[#F8FAFC] text-base sm:text-lg">
                Citizen Problem Count Analysis
            </h3>
            <div className="p-2 sm:p-4 bg-[#090D16] border border-[#3B82F6]/20 rounded-xl">
                <Bar data={chartData} options={chartOptions} />
            </div>

            <Modal
                title={<span className="text-[#F8FAFC] font-semibold text-lg">Detailed Tag Distribution</span>}
                open={ModalOpen}
                onCancel={onClose}
                footer={null}
                className="!bg-[#131B2E]"
            >
                <Pie_Comp data={pieData} />
            </Modal>
        </div>
    );
};

export default ChartANalyse;