import { useEffect, useState } from "react";
import { message } from "antd";
import { RightOutlined, UserOutlined, PhoneOutlined, NumberOutlined, AlertOutlined } from "@ant-design/icons";
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

    useEffect(() => {
        const fetchReport = async () => {
            setIsLoading(true);
            try {
                const pathSegments = window.location.pathname.split("/");
                const reqId = pathSegments[3];
                const itemId = pathSegments[5];
                const res = await axios.get(`${backend_url}/reports/${reqId}/items/${itemId}`, {
                    withCredentials: true
                });
                setData(res.data?.data?.reportData?.[0] || null);
            } catch (err) {
                console.error("Fetch error:", err);
                messageApi.error("Failed to fetch report data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, []);

    const redirectRequests = () => {
        navigate('/main/requests');
    };

    const redirectReport = () => {
        const pathsegments = window.location.pathname.split('/');
        const req_id = pathsegments[pathsegments.length - 3];
        navigate(`/main/report/${req_id}`);
    };

    return (
        <>
            {contextHolder}
            <MainAreaLayout
                title="Individual Citizen Report"
                description="Detailed AI analysis breakdown"
                loading={isLoading}
            >
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium mb-6 text-[#F8FAFC]/60">
                    <span onClick={redirectRequests} className="cursor-pointer hover:text-[#3B82F6] transition-colors">
                        Requests
                    </span>
                    <RightOutlined className="text-[10px]" />
                    <span onClick={redirectReport} className="cursor-pointer hover:text-[#3B82F6] transition-colors">
                        Report Overview
                    </span>
                    <RightOutlined className="text-[10px]" />
                    <span className="text-[#3B82F6] font-semibold">Citizen Record</span>
                </div>

                {!data ? (
                    <div className="p-8 text-center text-[#F8FAFC]/50 bg-[#131B2E] rounded-xl border border-[#3B82F6]/20">
                        No report data found.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Metadata Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-[#131B2E] border border-[#3B82F6]/20 rounded-xl shadow-lg flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center text-lg">
                                    <UserOutlined />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-[#F8FAFC]/50">Citizen Name</p>
                                    <p className="text-sm font-semibold text-[#F8FAFC] truncate">{data.name}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-[#131B2E] border border-[#3B82F6]/20 rounded-xl shadow-lg flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center text-lg">
                                    <PhoneOutlined />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-[#F8FAFC]/50">Mobile Contact</p>
                                    <p className="text-sm font-semibold text-[#F8FAFC] truncate">{data.mobileNo}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-[#131B2E] border border-[#3B82F6]/20 rounded-xl shadow-lg flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center text-lg">
                                    <NumberOutlined />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-[#F8FAFC]/50">Ward Number</p>
                                    <p className="text-sm font-semibold text-[#F8FAFC] truncate">Ward {data.wardNo}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-[#131B2E] border border-[#3B82F6]/20 rounded-xl shadow-lg flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center text-lg">
                                    <AlertOutlined />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-[#F8FAFC]/50">Total Issues</p>
                                    <p className="text-sm font-semibold text-[#3B82F6]">{data.numberOfProblems} Reported</p>
                                </div>
                            </div>
                        </div>

                        {/* Reported Problems List */}
                        <div className="bg-[#131B2E] border border-[#3B82F6]/20 rounded-xl p-5 sm:p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-[#F8FAFC] mb-4 pb-3 border-b border-[#3B82F6]/15 flex items-center gap-2">
                                📋 Categorized Problems ({data.problems.length})
                            </h3>
                            <div className="space-y-4">
                                {data.problems.map((prob, idx) => (
                                    <div 
                                        key={prob._id || idx} 
                                        className="p-4 bg-[#090D16] border border-[#3B82F6]/20 rounded-xl space-y-3"
                                    >
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-semibold text-[#F8FAFC]/60">Tags:</span>
                                            {prob.tags.map((tag, tIdx) => (
                                                <span 
                                                    key={tIdx} 
                                                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="space-y-1.5 text-xs sm:text-sm">
                                            <p className="text-[#F8FAFC]">
                                                <strong className="text-[#3B82F6]">English:</strong> {prob.english}
                                            </p>
                                            <p className="text-[#F8FAFC]/90">
                                                <strong className="text-[#3B82F6]">Hindi:</strong> {prob.hindi}
                                            </p>
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