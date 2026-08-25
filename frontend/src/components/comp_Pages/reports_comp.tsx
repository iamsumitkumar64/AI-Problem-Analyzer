import { useEffect, useState } from "react";
import { Button, message, Tooltip } from "antd";
import { EyeOutlined, RightOutlined, LineChartOutlined } from "@ant-design/icons";
import axios from "axios";
import CustomTable from "../customtable/index.tsx";
import MainAreaLayout from "../main_area_layout";
import backend_url from "../../Libs/env";
import { useNavigate } from "react-router-dom";

interface rawData {
    name: string,
    mobileNo: number,
    wardNo: string,
    numberOfProblems: number,
    problems: tags[],
    _id: string
}

interface tags {
    english: string,
    hindi: string,
    _id: string,
    tags: string[]
}

interface TableDataInterface {
    name: string,
    mobileNo: number,
    wardNo: string,
    numberOfProblems: number,
    rawTags: string[],
    tags: React.ReactNode,
    action: React.ReactNode
}

const ReportsPage_comp = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [, contextHolder] = message.useMessage();
    const [isdata, setIsdata] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        try {
            const pathSegments = window.location.pathname.split('/');
            const req_id = pathSegments[pathSegments.length - 1];
            const fetch = async () => {
                const ans = await axios.get(`${backend_url}/reports/${req_id}`, { withCredentials: true });
                const reportItems = ans.data?.data?.reportData || [];
                const data = reportItems.map((item: rawData) => {
                    const allTags = [...new Set((item.problems || []).flatMap(prob => prob.tags || []))];
                    return {
                        ...item,
                        rawTags: allTags,
                        tags: (
                            <div className="flex flex-wrap gap-1 max-w-[260px] max-h-16 overflow-y-auto pr-1">
                                {allTags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/25 whitespace-nowrap"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ),
                        action: (
                            <Button 
                                icon={<EyeOutlined />}
                                onClick={() => handleReport(item._id)}
                                className="!bg-[#3B82F6] hover:!bg-[#2563EB] !text-[#F8FAFC] !border-none text-xs h-8 px-3 rounded-lg flex items-center gap-1 shadow-sm whitespace-nowrap"
                            >
                                View Report
                            </Button>
                        ),
                    };
                });
                setIsdata(data);
            };
            fetch();
        } catch (err) {
            console.log(err);
        }
        finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }, []);

    const handleReport = (id: any) => {
        setIsLoading(true);
        const pathSegments = window.location.pathname.split('/');
        const req_id = pathSegments[pathSegments.length - 1];
        setTimeout(() => {
            if (id) {
                navigate(`/main/report/${encodeURIComponent(req_id)}/viewreport/${encodeURIComponent(id)}`);
            } else {
                console.error("ID is missing");
            }
            setIsLoading(false);
        }, 300);
    };

    const coldata = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 160,
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="truncate max-w-[150px] font-semibold text-[#F8FAFC]">
                        {text}
                    </div>
                </Tooltip>
            )
        },
        {
            title: "Ward No.",
            dataIndex: "wardNo",
            key: "wardNo",
            width: 100,
            sorter: (a: TableDataInterface, b: TableDataInterface) => a.wardNo.localeCompare(b.wardNo),
            filters: Array.from(new Set(isdata.map((item: any) => item.wardNo))).map((ward) => ({
                text: ward,
                value: ward,
            })),
            onFilter: (value: any, record: TableDataInterface) => record.wardNo === value,
        },
        {
            title: "Mobile No.",
            dataIndex: "mobileNo",
            key: "mobileNo",
            width: 130,
            render: (text: any) => <span className="text-xs text-[#F8FAFC]/80 whitespace-nowrap">{text}</span>
        },
        {
            title: "Problems",
            dataIndex: "numberOfProblems",
            key: "numberOfProblems",
            width: 110,
            sorter: (a: TableDataInterface, b: TableDataInterface) =>
                (a as any).numberOfProblems - (b as any).numberOfProblems,
            render: (text: any) => (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30 whitespace-nowrap">
                    {text}
                </span>
            )
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            width: 270,
            render: (_: any, record: any) => record.tags,
            filters: Array.from(
                new Set(isdata.flatMap((item: any) => item.rawTags))
            ).map((tag) => ({
                text: tag,
                value: tag,
            })),
            onFilter: (value: any, record: any) => record.rawTags.includes(value),
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            width: 130,
        },
    ];

    const redirectRequests = () => {
        navigate('/main/requests');
    };

    const pathSegments = window.location.pathname.split('/');
    const req_id = pathSegments[pathSegments.length - 1];

    const analyseButton = (
        <Button
            type="primary"
            icon={<LineChartOutlined />}
            onClick={() => navigate(`/main/analyse/${req_id}`)}
            className="!bg-[#3B82F6] hover:!bg-[#2563EB] !border-none text-xs sm:text-sm font-medium h-9 px-4 rounded-lg shadow-md shadow-[#3B82F6]/20 flex items-center gap-1.5"
        >
            Analyse Insights
        </Button>
    );

    return (
        <>
            {contextHolder}
            <MainAreaLayout
                title="AI Processed Report"
                description="Extracted details and issue categorization"
                loading={isLoading}
                extra={analyseButton}
            >
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium mb-4 text-[#F8FAFC]/60">
                    <span onClick={redirectRequests} className="cursor-pointer hover:text-[#3B82F6] transition-colors">
                        Requests
                    </span>
                    <RightOutlined className="text-[10px]" />
                    <span className="text-[#3B82F6] font-semibold">Report Overview</span>
                </div>

                <CustomTable
                    columns={coldata}
                    data={isdata}
                    serialNumberConfig={{ show: true, name: "Sr." }}
                />
            </MainAreaLayout>
        </>
    );
};

export default ReportsPage_comp;