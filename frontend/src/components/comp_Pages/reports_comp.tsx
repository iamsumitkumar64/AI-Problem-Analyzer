import { useEffect, useState, useMemo } from "react";
import { Button, message, Input } from "antd";
import { 
    EyeOutlined, 
    RightOutlined, 
    LineChartOutlined, 
    SearchOutlined,
    UserOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    TagsOutlined
} from "@ant-design/icons";
import axios from "axios";
import CustomTable from "../customtable/index.tsx";
import MainAreaLayout from "../main_area_layout";
import backend_url from "../../Libs/env";
import { useNavigate } from "react-router-dom";

interface ProblemItem {
    english: string;
    hindi: string;
    _id: string;
    tags: string[];
}

interface RawCitizenData {
    name: string;
    mobileNo: number;
    wardNo: string;
    numberOfProblems: number;
    problems: ProblemItem[];
    _id: string;
}

const ReportsPage_comp = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [, contextHolder] = message.useMessage();
    const [rawReportData, setRawReportData] = useState<RawCitizenData[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();

    const pathSegments = window.location.pathname.split('/');
    const req_id = pathSegments[pathSegments.length - 1];

    useEffect(() => {
        setIsLoading(true);
        const fetch = async () => {
            try {
                const ans = await axios.get(`${backend_url}/reports/${req_id}`, { withCredentials: true });
                const reportItems = ans.data?.data?.reportData || [];
                setRawReportData(reportItems);
            } catch (err) {
                console.error("Fetch report error:", err);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 250);
            }
        };
        fetch();
    }, [req_id]);

    // Analytics KPIs
    const totalProblems = useMemo(() => {
        return rawReportData.reduce((acc: number, curr: RawCitizenData) => acc + (curr.numberOfProblems || (curr.problems ? curr.problems.length : 1)), 0);
    }, [rawReportData]);

    const uniqueWards = useMemo(() => {
        return Array.from(new Set(rawReportData.map((c: RawCitizenData) => c.wardNo).filter(Boolean)));
    }, [rawReportData]);

    const topTag = useMemo(() => {
        const counts: Record<string, number> = {};
        rawReportData.forEach((item: RawCitizenData) => {
            (item.problems || []).forEach((p: ProblemItem) => {
                (p.tags || []).forEach((t: string) => {
                    counts[t] = (counts[t] || 0) + 1;
                });
            });
        });
        const entries = Object.entries(counts);
        if (entries.length === 0) return 'N/A';
        entries.sort((a, b) => b[1] - a[1]);
        return entries[0][0];
    }, [rawReportData]);

    // Filtered data
    const filteredData = useMemo(() => {
        return rawReportData.filter((item: RawCitizenData) => {
            const query = searchQuery.toLowerCase();
            const matchesName = (item.name || '').toLowerCase().includes(query);
            const matchesWard = String(item.wardNo || '').toLowerCase().includes(query);
            const matchesPhone = String(item.mobileNo || '').includes(query);
            const matchesTags = (item.problems || []).some((p: ProblemItem) => (p.tags || []).some((t: string) => t.toLowerCase().includes(query)));
            return matchesName || matchesWard || matchesPhone || matchesTags;
        });
    }, [rawReportData, searchQuery]);

    const tableRows = useMemo(() => {
        return filteredData.map((item: RawCitizenData) => {
            const allTags: string[] = Array.from(new Set((item.problems || []).flatMap((prob: ProblemItem) => prob.tags || [])));
            return {
                ...item,
                rawTags: allTags,
                nameNode: (
                    <div className="flex flex-col min-w-[140px]">
                        <span className="font-bold text-sm text-white truncate cursor-pointer hover:underline"
                            onClick={() => handleReport(item._id)}>
                            {item.name}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                            {item.mobileNo ? `+91 ${item.mobileNo}` : 'No phone'}
                        </span>
                    </div>
                ),
                wardNode: (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700 whitespace-nowrap">
                        <EnvironmentOutlined className="text-[10px]" />
                        Ward {item.wardNo}
                    </span>
                ),
                problemsNode: (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800 whitespace-nowrap">
                        {item.numberOfProblems || (item.problems ? item.problems.length : 1)} Issues
                    </span>
                ),
                tagsNode: (
                    <div className="flex flex-wrap gap-1 max-w-[280px] max-h-14 overflow-y-auto pr-1">
                        {allTags.map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 whitespace-nowrap"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                ),
                actionNode: (
                    <Button 
                        icon={<EyeOutlined />}
                        onClick={() => handleReport(item._id)}
                        className="!bg-zinc-800 hover:!bg-zinc-700 !text-white !border-zinc-700 text-xs h-8 px-3 rounded-xl flex items-center gap-1 shadow-sm whitespace-nowrap font-medium cursor-pointer"
                    >
                        View Record
                    </Button>
                ),
            };
        });
    }, [filteredData]);

    const handleReport = (id: string) => {
        if (id) {
            navigate(`/main/report/${encodeURIComponent(req_id)}/viewreport/${encodeURIComponent(id)}`);
        }
    };

    const coldata = [
        {
            title: "Citizen Name",
            dataIndex: "nameNode",
            key: "nameNode",
            width: 170,
        },
        {
            title: "Ward",
            dataIndex: "wardNode",
            key: "wardNode",
            width: 110,
        },
        {
            title: "Reported Issues",
            dataIndex: "problemsNode",
            key: "problemsNode",
            width: 130,
        },
        {
            title: "Identified Tags",
            dataIndex: "tagsNode",
            key: "tagsNode",
            width: 290,
        },
        {
            title: "Actions",
            dataIndex: "actionNode",
            key: "actionNode",
            width: 130,
        },
    ];

    return (
        <>
            {contextHolder}
            <MainAreaLayout
                title="Citizen Grievances Report"
                description={`Batch ID: ${req_id} • AI extracted and categorized citizen petitions`}
                loading={isLoading}
                extra={
                    <Button
                        type="primary"
                        icon={<LineChartOutlined />}
                        onClick={() => navigate(`/main/analyse/${req_id}`)}
                        className="!bg-white !text-black hover:!bg-zinc-200 !border-none text-xs sm:text-sm font-bold h-9 sm:h-10 px-4 sm:px-5 rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                        View AI Analytics & Charts
                    </Button>
                }
            >
                <div className="space-y-6">
                    {/* Breadcrumbs Navigation */}
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                        <span onClick={() => navigate('/main/requests')} className="cursor-pointer hover:text-white transition-colors">
                            Requests
                        </span>
                        <RightOutlined className="text-[9px] text-zinc-600" />
                        <span className="text-zinc-200 font-semibold">Grievances Overview</span>
                    </div>

                    {/* Quick KPI Summary Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-1">
                                <span className="text-xs font-mono uppercase">Total Citizens</span>
                                <UserOutlined className="text-zinc-400 text-sm" />
                            </div>
                            <span className="text-2xl font-bold text-white">{rawReportData.length}</span>
                        </div>

                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-1">
                                <span className="text-xs font-mono uppercase">Total Grievances</span>
                                <FileTextOutlined className="text-zinc-400 text-sm" />
                            </div>
                            <span className="text-2xl font-bold text-white">{totalProblems}</span>
                        </div>

                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-1">
                                <span className="text-xs font-mono uppercase">Wards Covered</span>
                                <EnvironmentOutlined className="text-emerald-400 text-sm" />
                            </div>
                            <span className="text-2xl font-bold text-emerald-400">{uniqueWards.length} Wards</span>
                        </div>

                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-1">
                                <span className="text-xs font-mono uppercase">Top Reported Sector</span>
                                <TagsOutlined className="text-zinc-400 text-sm" />
                            </div>
                            <span className="text-lg font-bold text-white truncate">#{topTag}</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-3 bg-[#121214] border border-white/[0.08] rounded-2xl">
                        <Input
                            placeholder="Filter by citizen name, ward number, mobile, or problem tags..."
                            prefix={<SearchOutlined className="text-zinc-500 mr-1 text-xs" />}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            allowClear
                            className="!bg-[#09090B] !border-white/[0.08] !text-zinc-100 !text-xs !h-9 !rounded-xl"
                        />
                    </div>

                    {/* Data Table */}
                    <CustomTable
                        columns={coldata}
                        data={tableRows}
                        serialNumberConfig={{ show: true, name: "#" }}
                    />
                </div>
            </MainAreaLayout>
        </>
    );
};

export default ReportsPage_comp;