import { useEffect, useState } from "react";
import { Button, message } from "antd";
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
    rawTags: string[], // used for filtering
    tags: React.ReactNode, // used for rendering
    action: React.ReactNode
}


const ReportsPage_comp = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isdata, setIsdata] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        try {
            const pathSegments = window.location.pathname.split('/');
            const req_id = pathSegments[pathSegments.length - 1];
            const fetch = async () => {
                const ans = await axios.get(`${backend_url}/report/${req_id}`, { withCredentials: true });
                const data = ans.data.data.reportData.map((item: rawData) => {
                    const allTags = [...new Set(item.problems.flatMap(prob => prob.tags))];
                    return {
                        ...item,
                        rawTags: allTags,
                        tags: (
                            <div>
                                {allTags.map((tag, index) => (
                                    <p
                                        key={index}
                                        className="border border-gray-400 text-blue-700 px-2 py-1 rounded-2xl text-sm inline-block m-1"
                                    >
                                        {tag}
                                    </p>
                                ))}
                            </div>
                        ),
                        action: <Button onClick={() => handleReport(item._id)}>View Report</Button>,
                    };
                });
                setIsdata(data);
                // messageApi.success(ans.data.message);
            }
            fetch();
        } catch (err) {
            console.log(err);
        }
        finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 700)
        }
    }, []);

    const handleReport = (id: any) => {
        // messageApi.info(id)
        setIsLoading(true);
        const pathSegments = window.location.pathname.split('/');
        const req_id = pathSegments[pathSegments.length - 1];
        setTimeout(() => {
            if (id) {
                navigate(`/main/report/${encodeURIComponent(req_id)}/viewreport/${encodeURIComponent(id)}`);
                // window.location.href = `/main/report/${encodeURIComponent(req_id)}/viewreport/${encodeURIComponent(id)}`;
            } else {
                console.error("ID is missing");
            }
            setIsLoading(false);
        }, 1000);
    };

    const coldata = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Ward No.",
            dataIndex: "wardNo",
            key: "wardNo",
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
        },
        {
            title: "Number of Problems",
            dataIndex: "numberOfProblems",
            key: "numberOfProblems",
            sorter: (a: TableDataInterface, b: TableDataInterface) =>
                (a as any).numberOfProblems - (b as any).numberOfProblems, // or fix below
        },
        // {
        //     title: "Problems",
        //     dataIndex: "problems",
        //     key: "problems",
        // },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
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
        },
    ];
    const redirectreports = () => {
        messageApi.info('Already Here');
        // window.location.reload();
    }
    const redirectRequests = () => {
        navigate('/main/requests');
        // window.location.href = `/main/requests`;
    }
    return (
        <>
            {contextHolder}
            <MainAreaLayout
                title="AI Report"
                description="Check your Report"
                loading={isLoading}
            >
                <div className="inline-flex">
                    <p onClick={redirectRequests} className="hover:cursor-pointer">Request</p>
                    <span className="mx-2">{'>'}</span>
                    <p onClick={redirectreports} className="hover:cursor-pointer">Report</p>
                </div>
                <CustomTable
                    columns={coldata}
                    data={isdata}
                    serialNumberConfig={{ show: true, name: "Sr. No." }}
                />
            </MainAreaLayout>
        </>
    );
};

export default ReportsPage_comp;