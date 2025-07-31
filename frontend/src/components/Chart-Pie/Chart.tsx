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
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
import { Pie_Comp } from './pie';
import { Modal } from 'antd';

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
        return <p>No data available</p>;
    }

    const chartData = {
        labels: datas.map((item) => item.name),
        datasets: [
            {
                label: 'No. of Problems',
                data: datas.map((item) => item.numberOfProblems),
                backgroundColor: ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'],
                borderColor: ['#B91C1C', '#1D4ED8', '#B45309', '#047857', '#6D28D9', '#BE185D'],
                borderWidth: 1.5,
                hoverOffset: 10
            },
            {
                label: 'Complaints',
                data: datas.map((item) => item.problems.length),
                backgroundColor: ['#F97316', '#22D3EE', '#A3E635', '#FB7185', '#6366F1', '#14B8A6'],
                borderColor: ['#C2410C', '#0E7490', '#4D7C0F', '#BE123C', '#4338CA', '#0F766E'],
                borderWidth: 0.5,
                hoverOffset: 10
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 0,
                },
            },
        },
        onClick: (event: ChartEvent, elements: any) => {
            console.log(event)
            const index = elements[0].index;
            const clickedData = datas[index];
            setPieData(clickedData);
            setModalOpen(true);
        }
    };
    const onClose = () => {
        setModalOpen(false);
    };
    return (
        <>
            <h2 style={{ textAlign: 'center' }}>Problem Analysis Chart</h2>
            <Bar
                data={chartData}
                options={chartOptions}
            />
            <Modal
                title={'Pie Chart'}
                open={ModalOpen}
                onCancel={onClose}
                footer={'Made By Sumit Kumar'}>
                <Pie_Comp data={pieData} />
            </Modal>
        </>
    );
};


export default ChartANalyse;