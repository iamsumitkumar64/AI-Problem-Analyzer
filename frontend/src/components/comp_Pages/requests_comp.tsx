import { useState, useEffect } from 'react';
import CustomTable from '../customtable/index.tsx';
import MainAreaLayout from '../main_area_layout/index.tsx';
import { Button, Modal, Form, Input, message, Upload, Tooltip } from 'antd';
import { UploadOutlined, PlusOutlined, DownOutlined, EyeOutlined, DeleteOutlined, FileTextOutlined, LineChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import backend_url from '../../Libs/env.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { socket } from '../../config/socket';

const RequestsPage_comp = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [isdata, setIsdata] = useState([]);
    const [isIframe, setIsFrame] = useState<boolean>(false);
    const [iframeFile, setIframeFile] = useState<String>('');
    const navigate = useNavigate();

    const actionMenu = (item: any) => {
        const isComplete = item.rawStatus === 'Complete' || (item.rawDocuments && item.rawDocuments > 0);
        return (
            <Menu className="!bg-[#131B2E] !border !border-[#3B82F6]/20 !p-1 rounded-xl shadow-xl">
                <Menu.Item 
                    key="preview" 
                    onClick={() => handlepreview(item.id)} 
                    className="!text-[#F8FAFC] hover:!bg-[#3B82F6]/20 !rounded-lg"
                    icon={<EyeOutlined className="text-[#3B82F6]" />}
                >
                    Preview PDF
                </Menu.Item>
                {isComplete ? (
                    <>
                        <Menu.Item 
                            key="analyse" 
                            onClick={() => handleAnalyse(item.id)} 
                            className="!text-[#F8FAFC] hover:!bg-[#3B82F6]/20 !rounded-lg font-medium"
                            icon={<LineChartOutlined className="text-[#3B82F6]" />}
                        >
                            Analyse Report
                        </Menu.Item>
                        <Menu.Item 
                            key="viewDocs" 
                            onClick={() => navigate(`/main/report/${item.id}`)} 
                            className="!text-[#F8FAFC] hover:!bg-[#3B82F6]/20 !rounded-lg"
                            icon={<FileTextOutlined className="text-[#3B82F6]" />}
                        >
                            View Documents
                        </Menu.Item>
                    </>
                ) : (
                    <Menu.Item 
                        key="report" 
                        onClick={() => handlereport(item.id)} 
                        className="!text-[#F8FAFC] hover:!bg-[#3B82F6]/20 !rounded-lg"
                        icon={<FileTextOutlined className="text-[#3B82F6]" />}
                    >
                        Generate Report
                    </Menu.Item>
                )}
                <Menu.Item 
                    key="delete" 
                    onClick={() => handleDelete(item.id)} 
                    className="!text-[#F8FAFC] hover:!bg-red-500/20 !rounded-lg"
                    icon={<DeleteOutlined className="text-red-400" />}
                >
                    Delete
                </Menu.Item>
            </Menu>
        );
    };

    const fetch = async () => {
        setIsLoading(true);
        try {
            const ans = await axios.get(`${backend_url}/requests`, { withCredentials: true });
            const rawList = ans.data?.data || [];
            const requests = rawList.map((item: any) => {
                const itemStatus = item.status || 'Created';
                const itemDocs = item.documents || 0;
                const rawItem = { ...item, rawStatus: itemStatus, rawDocuments: itemDocs };

                return {
                    ...item,
                    rawStatus: itemStatus,
                    rawDocuments: itemDocs,
                    documents: (
                        <Link 
                            to={`/main/report/${item.id}`} 
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 hover:bg-[#3B82F6]/20 transition-all whitespace-nowrap"
                        >
                            📄 {itemDocs} Docs
                        </Link>
                    ),
                    status: (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                            itemStatus === 'Complete' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            itemStatus === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20'
                        }`}>
                            {itemStatus}
                        </span>
                    ),
                    action: (
                        <Dropdown overlay={actionMenu(rawItem)} trigger={['click']}>
                            <Button className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30 hover:!border-[#3B82F6] text-xs h-8 px-3 rounded-lg flex items-center gap-1 whitespace-nowrap">
                                Actions <DownOutlined className="text-[10px]" />
                            </Button>
                        </Dropdown>
                    ),
                };
            });
            setIsdata(requests);
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
        const handleReportSocket = () => {
            fetch(); 
        };
        socket.on('report', handleReportSocket);
        return () => {
            socket.off('report', handleReportSocket);
        };
    }, []);

    const coldata = [
        { 
            title: "Title", 
            dataIndex: "title", 
            key: "title",
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
            title: "Description", 
            dataIndex: "description", 
            key: "description",
            width: 240,
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="line-clamp-2 max-w-[230px] text-xs text-[#F8FAFC]/80 whitespace-normal">
                        {text}
                    </div>
                </Tooltip>
            )
        },
        { 
            title: "Created At", 
            dataIndex: "createdAt", 
            key: "createdAt",
            width: 170,
            render: (text: string) => (
                <span className="text-xs text-[#F8FAFC]/60 whitespace-nowrap">
                    {text ? new Date(text).toLocaleString() : '-'}
                </span>
            )
        },
        { title: "Documents", dataIndex: "documents", key: "documents", width: 110 },
        { title: "Status", dataIndex: "status", key: "status", width: 110 },
        { title: "Action", dataIndex: "action", key: "action", width: 120 },
    ];

    const handleDelete = async (id: any) => {
        await axios.delete(`${backend_url}/requests/${id}`, { withCredentials: true });
        fetch();
    };

    const handlepreview = async (id: any) => {
        const ans = await axios.get(`${backend_url}/requests/${id}/preview`, { withCredentials: true });
        setIframeFile(ans.data.file_address);
        setIsFrame(true);
    };

    const handlereport = async (id: any) => {
        setIsLoading(true);
        try {
            const ans = await axios.get(`${backend_url}/requests/${id}/report`, { withCredentials: true });
            if (ans.status === 200 || ans.status === 202) {
                await fetch();
                messageApi.success('Report Generation Started');
            } else {
                messageApi.error('Failed to generate report');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const errorMsg = error.response?.data?.message;
                console.error(errorMsg);
                messageApi.error(errorMsg);
            }
            messageApi.error('Failed to generate Requests');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyse = async (id: any) => {
        setIsLoading(true);
        setTimeout(() => {
            navigate(`/main/anlayse/${id}`);
        }, 300);
    };

    const showModal = () => {
        setModalOpen(true);
        form.resetFields();
    };

    const User_button: React.FC = () => (
        <Button 
            type="primary" 
            onClick={showModal}
            icon={<PlusOutlined />}
            className="!bg-[#3B82F6] hover:!bg-[#2563EB] !border-none text-xs sm:text-sm font-medium h-9 px-4 rounded-lg shadow-md shadow-[#3B82F6]/20 flex items-center"
        >
            Add Request
        </Button>
    );

    const onOk = async () => {
        try {
            let values = await form.validateFields();
            const form_data = new FormData();
            form_data.append('title', values.title);
            form_data.append('description', values.description);
            form_data.append('pdffile', values.pdffile[0].originFileObj);
            await axios.post(`${backend_url}/requests`, form_data, { withCredentials: true });
            form.resetFields();
            setModalOpen(false);
            fetch();
            messageApi.success('Request created successfully!');
        } catch (errorInfo: any) {
            messageApi.error(errorInfo?.response?.data?.message || 'Validation failed');
            console.log('Validation Failed:', errorInfo);
        }
    };

    const onClose = () => {
        setModalOpen(false);
        form.resetFields();
    };

    const onCloseIframe = () => {
        setIsFrame(false);
    };

    return (
        <>
            {contextHolder}
            <MainAreaLayout
                title="Requests List"
                description="Analyze your handwritten problem requests using AI"
                loading={isLoading}
                extra={<User_button />}
            >
                <CustomTable
                    columns={coldata}
                    data={isdata}
                    serialNumberConfig={{ show: true, name: "Sr." }}
                />
            </MainAreaLayout>

            {/* Create Request Modal */}
            <Modal
                title={<span className="text-[#F8FAFC] font-semibold text-base sm:text-lg">Create New Request</span>}
                open={ModalOpen}
                onOk={onOk}
                onCancel={onClose}
                okText="Submit"
                className="!bg-[#131B2E] text-[#F8FAFC]"
                okButtonProps={{ className: "!bg-[#3B82F6] hover:!bg-[#2563EB] !border-none" }}
                cancelButtonProps={{ className: "!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30" }}
                width={500}
                style={{ maxWidth: '95vw', top: 20 }}
            >
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={{ title: '', description: '' }}
                    requiredMark={false}
                    className="pt-2"
                >
                    <Form.Item
                        label={<span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">Title</span>}
                        name="title"
                        rules={[{ required: true, message: 'Please enter title!' }]}
                    >
                        <Input placeholder="Enter request title" className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">Description</span>}
                        name="description"
                        rules={[{ required: true, message: 'Please enter description' }]}
                    >
                        <Input.TextArea placeholder="Enter request description" rows={3} className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">PDF Document</span>}
                        name="pdffile"
                        rules={[{ required: true, message: 'Please upload a PDF file!' }]}
                        valuePropName="fileList"
                        getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                    >
                        <Upload 
                            beforeUpload={() => false}
                            accept="application/pdf"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined className="text-[#3B82F6]" />} className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30">
                                Select PDF Document
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Preview Modal */}
            <Modal
                title={<span className="text-[#F8FAFC] font-semibold text-base sm:text-lg">Document Preview</span>}
                open={isIframe}
                onCancel={onCloseIframe}
                footer={null}
                width={800}
                style={{ maxWidth: '95vw', top: 20 }}
            >
                <div className="w-full h-[70vh] rounded-lg overflow-hidden border border-[#3B82F6]/20 bg-[#090D16]">
                    <iframe
                        src={iframeFile as string}
                        className="w-full h-full border-none"
                        title="PDF Preview"
                    />
                </div>
            </Modal>
        </>
    );
};

export default RequestsPage_comp;