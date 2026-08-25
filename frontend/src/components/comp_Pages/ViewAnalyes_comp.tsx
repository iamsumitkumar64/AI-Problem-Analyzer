import MainAreaLayout from '../main_area_layout/index.tsx';
import { Button } from 'antd';
import { useState, useEffect } from 'react';
import backend_url from '../../Libs/env.tsx';
import axios from 'axios';
import CommonProblem from '../Problems/common.tsx';
import WardWiseProblem from '../Problems/wardwise.tsx';
import ChartANalyse from '../Chart-Pie/Chart.tsx';
import { AppstoreOutlined, EnvironmentOutlined, PieChartOutlined } from '@ant-design/icons';

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

const ViewAnalyes_comp = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isData, setIsData] = useState<DataInterface[] | null>(null);
    const [selectedButton, setSelectedButton] = useState<string>('ward');

    const fetch = async () => {
        setIsLoading(true);
        try {
            const reqId = window.location.pathname.split('/')[3];
            const ans = await axios.get(`${backend_url}/reports/${reqId}`, {
                withCredentials: true
            });
            setIsData(ans.data?.data?.reportData || []);
        } catch (err) {
            console.log(err);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const handleClick = (buttonId: string) => {
        setSelectedButton(buttonId);
    };

    const getBtnClasses = (buttonId: string) => `
        h-9 sm:h-10 px-4 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-2
        ${selectedButton === buttonId 
            ? '!bg-[#3B82F6] !text-[#F8FAFC] !border-none shadow-lg shadow-[#3B82F6]/30 font-semibold' 
            : '!bg-[#090D16] !text-[#F8FAFC]/70 !border-[#3B82F6]/30 hover:!text-[#F8FAFC] hover:!border-[#3B82F6]'}
    `;

    return (
        <>
            <MainAreaLayout
                title="AI Analytics & Insights"
                description="Ward-wise distribution and pattern recognition"
                loading={isLoading}
            >
                {/* View Switcher Controls */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 p-2 bg-[#131B2E] border border-[#3B82F6]/20 rounded-xl max-w-max">
                    <Button
                        className={getBtnClasses('ward')}
                        onClick={() => handleClick('ward')}
                        icon={<EnvironmentOutlined />}
                    >
                        Ward Wise Breakdown
                    </Button>
                    <Button
                        className={getBtnClasses('common')}
                        onClick={() => handleClick('common')}
                        icon={<AppstoreOutlined />}
                    >
                        Common Problems
                    </Button>
                    <Button
                        className={getBtnClasses('analyses')}
                        onClick={() => handleClick('analyses')}
                        icon={<PieChartOutlined />}
                    >
                        Pie Chart View
                    </Button>
                </div>

                {/* Content Panel Container */}
                <div className="bg-[#131B2E] border border-[#3B82F6]/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
                    {selectedButton === 'common' && <CommonProblem data={isData} />}
                    {selectedButton === 'ward' && <WardWiseProblem data={isData} />}
                    {selectedButton === 'analyses' && <ChartANalyse datas={isData} />}
                </div>
            </MainAreaLayout>
        </>
    );
};

export default ViewAnalyes_comp;