import { useEffect, useState } from "react";
import { message } from "antd";
import { 
    RightOutlined, 
    UserOutlined, 
    PhoneOutlined, 
    EnvironmentOutlined, 
    FileTextOutlined
} from "@ant-design/icons";
import axios from "axios";
import MainAreaLayout from "../main_area_layout";
import backend_url from "../../Libs/env";
import { useNavigate } from "react-router-dom";

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

const IndividualReportPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState<DataInterface | null>(null);
    const navigate = useNavigate();

    const pathSegments = window.location.pathname.split("/");
    const reqId = pathSegments[3];
    const itemId = pathSegments[5];

    useEffect(() => {
        const fetchReport = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${backend_url}/reports/${reqId}/items/${itemId}`, {
                    withCredentials: true
                });
                setData(res.data?.data?.reportData?.[0] || null);
            } catch (err) {
                console.error("Fetch error:", err);
                messageApi.error("Failed to fetch citizen record");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, [reqId, itemId]);

    return (
        <>
            {contextHolder}
            <MainAreaLayout
                title="Citizen Petition Record"
                description={`Verification ID: ${itemId} • Detailed bilingual AI transcription`}
                loading={isLoading}
            >
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-medium mb-6 text-zinc-400">
                    <span onClick={() => navigate('/main/requests')} className="cursor-pointer hover:text-white transition-colors">
                        Requests
                    </span>
                    <RightOutlined className="text-[9px] text-zinc-600" />
                    <span onClick={() => navigate(`/main/report/${reqId}`)} className="cursor-pointer hover:text-white transition-colors">
                        Grievances Overview
                    </span>
                    <RightOutlined className="text-[9px] text-zinc-600" />
                    <span className="text-zinc-200 font-semibold">{data?.name || 'Citizen Record'}</span>
                </div>

                {!data ? (
                    <div className="p-12 text-center text-zinc-500 bg-[#121214] rounded-2xl border border-white/[0.08]">
                        Citizen record not found.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Metadata Cards Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center text-lg flex-shrink-0">
                                    <UserOutlined />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] text-zinc-500">Citizen Name</p>
                                    <p className="text-sm font-bold text-white truncate">{data.name}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center text-lg flex-shrink-0">
                                    <PhoneOutlined />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] text-zinc-500">Contact Number</p>
                                    <p className="text-sm font-bold text-zinc-200 font-mono truncate">
                                        {data.mobileNo ? `+91 ${data.mobileNo}` : 'Unlisted'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center text-lg flex-shrink-0">
                                    <EnvironmentOutlined />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] text-zinc-500">Jurisdiction</p>
                                    <p className="text-sm font-bold text-emerald-400 truncate">Ward {data.wardNo}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center text-lg flex-shrink-0">
                                    <FileTextOutlined />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] text-zinc-500">Total Grievances</p>
                                    <p className="text-sm font-bold text-white">
                                        {data.numberOfProblems || (data.problems ? data.problems.length : 1)} Issues
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reported Problems Breakdown */}
                        <div className="bg-[#121214] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    Extracted Grievance Petitions ({data.problems?.length || 0})
                                </h3>
                                <span className="text-xs font-mono text-zinc-500">
                                    Source: Scanned Petition OCR
                                </span>
                            </div>

                            <div className="space-y-4">
                                {(data.problems || []).map((prob, idx) => (
                                    <div 
                                        key={prob._id || idx} 
                                        className="p-5 bg-[#09090B] border border-white/[0.08] rounded-2xl space-y-3.5 shadow-sm"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/[0.04]">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-zinc-300 font-mono">
                                                    Issue #{idx + 1}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {prob.tags.map((tag, tIdx) => (
                                                    <span 
                                                        key={tIdx} 
                                                        className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* English Translation */}
                                            <div className="p-3.5 bg-[#121214] rounded-xl border border-white/[0.04] space-y-1">
                                                <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                                    AI English Summary
                                                </span>
                                                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                                                    {prob.english || 'N/A'}
                                                </p>
                                            </div>

                                            {/* Original Hindi */}
                                            <div className="p-3.5 bg-[#121214] rounded-xl border border-white/[0.04] space-y-1">
                                                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1">
                                                    मूल हिंदी शिकायत (Original Hindi)
                                                </span>
                                                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                                                    {prob.hindi || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </MainAreaLayout>
        </>
    );
};

export default IndividualReportPage;