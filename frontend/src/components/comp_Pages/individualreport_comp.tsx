import { useEffect, useState } from "react";
import { message } from "antd";
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

const OneReportPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState<DataInterface | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReport = async () => {
            setIsLoading(true);
            try {
                const reqId = window.location.pathname.split("/")[5]
                const res = await axios.get(`${backend_url}/report/Onereport/${reqId}`, {
                    withCredentials: true
                });
                setData(res.data.data.reportData[0]);
                // messageApi.success(res.data.message);
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
        // window.location.href = '/main/requests';
        navigate('/main/requests');
    }
    const redirectView = () => {
        messageApi.info('Already Here');
        // window.location.reload();
    }
    const redirectReport = () => {
        const pathsegments = window.location.pathname.split('/');
        const req_id = pathsegments[pathsegments.length - 3];
        navigate(`/main/report/${req_id}`);
        // window.location.href = `/main/report/${req_id}`;
    }
    return (
        <>
            {contextHolder}
            <MainAreaLayout
                title="Your Report"
                description="Check your Report"
                loading={isLoading}
            >
                <div className="inline-flex">
                    <p onClick={redirectRequests} className="hover:cursor-pointer">Request</p>
                    <span className="mx-2">{'>'}</span>
                    <p onClick={redirectReport} className="hover:cursor-pointer">Report</p>
                    <span className="mx-2">{'>'}</span>
                    <p onClick={redirectView} className="hover:cursor-pointer">View</p>
                </div>
                {!data ? (
                    <p>No data found</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 p-4 bg-white dark:bg-gray-600 shadow-md rounded-md border border-blue-400 dark:border-blue-600">
                            <div className="flex justify-between border border-gray-300 dark:border-gray-700 p-4 text-center">
                                <p className="font-semibold text-gray-500 dark:text-gray-200">Name:</p>
                                <p className="text-gray-700 dark:text-gray-300">{data.name}</p>
                            </div>
                            <div className="flex justify-between border border-gray-300 dark:border-gray-700 p-4 text-center">
                                <p className="font-semibold text-gray-500 dark:text-gray-200">Mobile:</p>
                                <p className="text-gray-700 dark:text-gray-300">{data.mobileNo}</p>
                            </div>
                            <div className="flex justify-between border border-gray-300 dark:border-gray-700 p-4 text-center">
                                <p className="font-semibold text-gray-500 dark:text-gray-200">Ward No:</p>
                                <p className="text-gray-700 dark:text-gray-300">{data.wardNo}</p>
                            </div>
                            <div className="flex justify-between border border-gray-300 dark:border-gray-700 p-4 text-center">
                                <p className="font-semibold text-gray-500 dark:text-gray-200">No. of Problems:</p>
                                <p className="text-gray-700 dark:text-gray-300">{data.numberOfProblems}</p>
                            </div>
                        </div>
                        <div>
                            <h3 style={{ marginTop: "3rem", fontSize: '2vmax', fontWeight: '800' }}>Reported Problems</h3>
                            {data.problems.map((prob) => (
                                <div key={prob._id} style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                                    <div className="inline-flex gap-2"><strong>Tags:</strong>
                                        {prob.tags.map((onetag) => (
                                            <p className="bg-slate-600 text-white border border-blue-800 rounded-md">{onetag}</p>
                                        ))}
                                    </div>
                                    <p><strong>English:</strong> {prob.english}</p>
                                    <p><strong>Hindi:</strong> {prob.hindi}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </MainAreaLayout>
        </>
    );
};

export default OneReportPage;