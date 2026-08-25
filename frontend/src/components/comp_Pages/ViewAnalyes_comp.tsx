import MainAreaLayout from '../main_area_layout/index.tsx';
import { Button } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import backend_url from '../../Libs/env.tsx';
import axios from 'axios';
import CommonProblem from '../Problems/common.tsx';
import WardWiseProblem from '../Problems/wardwise.tsx';
import ChartANalyse from '../Chart-Pie/Chart.tsx';
import { 
    AppstoreOutlined, 
    EnvironmentOutlined, 
    PieChartOutlined, 
    RightOutlined,
    FileTextOutlined,
    UserOutlined,
    TagsOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const pathSegments = window.location.pathname.split('/');
    const reqId = pathSegments[pathSegments.length - 1];

    const fetch = async () => {
        setIsLoading(true);
        try {
            const ans = await axios.get(`${backend_url}/reports/${reqId}`, {
                withCredentials: true
            });
            setIsData(ans.data?.data?.reportData || []);
        } catch (err) {
            console.error("Fetch analytics error:", err);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 250);
        }
    };

    useEffect(() => {
        fetch();
    }, [reqId]);

    // Analytics KPIs
    const totalProblems = useMemo(() => {
        if (!isData) return 0;
        return isData.reduce((acc, curr) => acc + (curr.numberOfProblems || (curr.problems ? curr.problems.length : 1)), 0);
    }, [isData]);

    const wardCounts = useMemo(() => {
        if (!isData) return { topWard: 'N/A', uniqueCount: 0 };
        const counts: Record<string, number> = {};
        isData.forEach(item => {
            const w = item.wardNo || '1';
            counts[w] = (counts[w] || 0) + (item.problems?.length || 1);
        });
        const entries = Object.entries(counts);
        if (entries.length === 0) return { topWard: 'N/A', uniqueCount: 0 };
        entries.sort((a, b) => b[1] - a[1]);
        return { topWard: `Ward ${entries[0][0]} (${entries[0][1]} issues)`, uniqueCount: entries.length };
    }, [isData]);

    const topCategory = useMemo(() => {
        if (!isData) return 'N/A';
        const counts: Record<string, number> = {};
        isData.forEach(item => {
            (item.problems || []).forEach(p => {
                (p.tags || []).forEach(t => {
                    counts[t] = (counts[t] || 0) + 1;
                });
            });
        });
        const entries = Object.entries(counts);
        if (entries.length === 0) return 'N/A';
        entries.sort((a, b) => b[1] - a[1]);
        return `${entries[0][0]} (${entries[0][1]})`;
    }, [isData]);

    const getBtnClasses = (buttonId: string) => `
        h-9 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer
        ${selectedButton === buttonId 
            ? '!bg-white !text-black !border-none shadow-md font-bold' 
            : '!bg-transparent !text-zinc-400 !border-none hover:!text-white hover:!bg-white/[0.06]'}
    `;

    return (
        <>
            <MainAreaLayout
                title="AI Analytics & Intelligence"
                description={`Batch ID: ${reqId} • Pattern recognition and spatial clustering`}
                loading={isLoading}
            >
                <div className="space-y-6">
                    {/* Breadcrumbs Navigation */}
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                        <span onClick={() => navigate('/main/requests')} className="cursor-pointer hover:text-white transition-colors">
                            Requests
                        </span>
                        <RightOutlined className="text-[9px] text-zinc-600" />
                        <span onClick={() => navigate(`/main/report/${reqId}`)} className="cursor-pointer hover:text-white transition-colors">
                            Grievances Overview
                        </span>
                        <RightOutlined className="text-[9px] text-zinc-600" />
                        <span className="text-zinc-200 font-semibold">AI Analytics & Visuals</span>
                    </div>

                    {/* KPI Highlights Strip */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-1">
                                <span className="text-xs font-mono uppercase">Total Issues Analyzed</span>
                                <FileTextOutlined className="text-zinc-400 text-sm" />
                            </div>
                            <span className="text-2xl font-bold text-white">{totalProblems}</span>
                        </div>

                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-1">
                                <span className="text-xs font-mono uppercase">Most Impacted Ward</span>
                                <EnvironmentOutlined className="text-zinc-400 text-sm" />
                            </div>
                            <span className="text-base font-bold text-white truncate">{wardCounts.topWard}</span>
                        </div>

                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-1">
                                <span className="text-xs font-mono uppercase">Dominant Sector</span>
                                <TagsOutlined className="text-zinc-400 text-sm" />
                            </div>
                            <span className="text-base font-bold text-white truncate">#{topCategory}</span>
                        </div>

                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-1">
                                <span className="text-xs font-mono uppercase">Citizens Represented</span>
                                <UserOutlined className="text-zinc-400 text-sm" />
                            </div>
                            <span className="text-2xl font-bold text-emerald-400">{isData?.length || 0} Petitions</span>
                        </div>
                    </div>

                    {/* View Switcher Segmented Toolbar */}
                    <div className="flex items-center gap-1.5 p-1 bg-[#121214] border border-white/[0.08] rounded-2xl max-w-max">
                        <Button
                            className={getBtnClasses('ward')}
                            onClick={() => setSelectedButton('ward')}
                            icon={<EnvironmentOutlined />}
                        >
                            Ward Wise Distribution
                        </Button>
                        <Button
                            className={getBtnClasses('common')}
                            onClick={() => setSelectedButton('common')}
                            icon={<AppstoreOutlined />}
                        >
                            Category Breakdown
                        </Button>
                        <Button
                            className={getBtnClasses('analyses')}
                            onClick={() => setSelectedButton('analyses')}
                            icon={<PieChartOutlined />}
                        >
                            Visual Chart Matrix
                        </Button>
                    </div>

                    {/* Content Panel Container */}
                    <div className="bg-[#121214] border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-2xl">
                        {selectedButton === 'ward' && <WardWiseProblem data={isData} />}
                        {selectedButton === 'common' && <CommonProblem data={isData} />}
                        {selectedButton === 'analyses' && <ChartANalyse datas={isData} />}
                    </div>
                </div>
            </MainAreaLayout>
        </>
    );
};

export default ViewAnalyes_comp;