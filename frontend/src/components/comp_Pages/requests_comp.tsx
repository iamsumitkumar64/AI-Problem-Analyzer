import { useState, useEffect, useMemo } from 'react';
import CustomTable from '../customtable/index.tsx';
import MainAreaLayout from '../main_area_layout/index.tsx';
import { Button, Modal, Form, Input, message, Upload, Tooltip, Dropdown, Menu } from 'antd';
import { 
    UploadOutlined, 
    PlusOutlined, 
    DownOutlined, 
    EyeOutlined, 
    DeleteOutlined, 
    FileTextOutlined, 
    LineChartOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    DatabaseOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import axios from 'axios';
import backend_url from '../../Libs/env.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { socket } from '../../config/socket';

const RequestsPage_comp = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [rawRequests, setRawRequests] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isIframe, setIsFrame] = useState<boolean>(false);
    const [iframeFile, setIframeFile] = useState<string>('');
    const navigate = useNavigate();

    const fetch = async () => {
        setIsLoading(true);
        try {
            const ans = await axios.get(`${backend_url}/requests`, { withCredentials: true });
            const list = ans.data?.data || [];
            setRawRequests(list);
        } catch (err) {
            console.error('Fetch requests error:', err);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 250);
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

    // Summary KPIs
    const totalDocs = useMemo(() => {
        return rawRequests.reduce((acc, curr) => acc + (curr.documents || 0), 0);
    }, [rawRequests]);

    const completedBatches = useMemo(() => {
        return rawRequests.filter(r => r.status === 'Complete').length;
    }, [rawRequests]);

    // Client-side filtered list
    const filteredRequests = useMemo(() => {
        return rawRequests.filter(item => {
            const matchesSearch = 
                (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = 
                statusFilter === 'all' ? true :
                statusFilter === 'complete' ? item.status === 'Complete' :
                statusFilter === 'pending' ? item.status === 'Pending' : true;

            return matchesSearch && matchesStatus;
        });
    }, [rawRequests, searchQuery, statusFilter]);

    const actionMenu = (item: any) => {
        const isComplete = item.rawStatus === 'Complete' || (item.rawDocuments && item.rawDocuments > 0);
        return (
            <Menu className="!bg-[#121214] !border !border-white/[0.1] !p-1.5 rounded-xl shadow-2xl">
                <Menu.Item 
                    key="preview" 
                    onClick={() => handlepreview(item.id)} 
                    className="!text-zinc-200 hover:!bg-white/[0.08] !rounded-lg"
                    icon={<EyeOutlined className="text-zinc-400" />}
                >
                    Preview PDF
                </Menu.Item>
                {isComplete ? (
                    <>
                        <Menu.Item 
                            key="analyse" 
                            onClick={() => handleAnalyse(item.id)} 
                            className="!text-white hover:!bg-white/[0.1] !rounded-lg font-semibold"
                            icon={<LineChartOutlined className="text-white" />}
                        >
                            Analyse Report
                        </Menu.Item>
                        <Menu.Item 
                            key="viewDocs" 
                            onClick={() => navigate(`/main/report/${item.id}`)} 
                            className="!text-zinc-200 hover:!bg-white/[0.08] !rounded-lg"
                            icon={<FileTextOutlined className="text-zinc-400" />}
                        >
                            View Documents ({item.rawDocuments})
                        </Menu.Item>
                    </>
                ) : (
                    <Menu.Item 
                        key="report" 
                        onClick={() => handlereport(item.id)} 
                        className="!text-white hover:!bg-white/[0.1] !rounded-lg font-semibold"
                        icon={<ThunderboltOutlined className="text-white" />}
                    >
                        Generate Report (AI)
                    </Menu.Item>
                )}
                <Menu.Divider className="!border-white/[0.06] !my-1" />
                <Menu.Item 
                    key="delete" 
                    onClick={() => handleDelete(item.id)} 
                    className="!text-rose-400 hover:!bg-rose-500/10 !rounded-lg"
                    icon={<DeleteOutlined className="text-rose-400" />}
                >
                    Delete Batch
                </Menu.Item>
            </Menu>
        );
    };

    const tableData = useMemo(() => {
        return filteredRequests.map((item: any) => {
            const itemStatus = item.status || 'Created';
            const itemDocs = item.documents || 0;
            const rawItem = { ...item, rawStatus: itemStatus, rawDocuments: itemDocs };

            return {
                ...item,
                rawStatus: itemStatus,
                rawDocuments: itemDocs,
                titleNode: (
                    <div className="flex flex-col gap-0.5 max-w-[240px]">
                        <Tooltip title={item.title} placement="topLeft">
                            <span className="font-bold text-sm text-white truncate cursor-pointer hover:underline"
                                onClick={() => navigate(itemStatus === 'Complete' ? `/main/analyse/${item.id}` : `/main/report/${item.id}`)}>
                                {item.title || 'Untitled Request'}
                            </span>
                        </Tooltip>
                        <Tooltip title={item.description} placement="topLeft">
                            <span className="text-xs text-zinc-500 line-clamp-1 truncate">
                                {item.description || 'No description provided'}
                            </span>
                        </Tooltip>
                    </div>
                ),
                documentsNode: (
                    <Link 
                        to={`/main/report/${item.id}`} 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 transition-all whitespace-nowrap"
                    >
                        <FileTextOutlined className="text-[11px]" />
                        {itemDocs} {itemDocs === 1 ? 'Citizen' : 'Citizens'}
                    </Link>
                ),
                statusNode: (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        itemStatus === 'Complete' 
                            ? 'bg-zinc-800 text-white border border-zinc-700' :
                        itemStatus === 'Pending' 
                            ? 'bg-zinc-900 text-zinc-400 border border-zinc-800' :
                            'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                            itemStatus === 'Complete' ? 'bg-emerald-400' :
                            itemStatus === 'Pending' ? 'bg-amber-400 animate-pulse' : 'bg-zinc-500'
                        }`} />
                        {itemStatus}
                    </span>
                ),
                actionNode: (
                    <Dropdown overlay={actionMenu(rawItem)} trigger={['click']}>
                        <Button className="!bg-zinc-900 !text-zinc-200 !border-zinc-800 hover:!border-zinc-600 hover:!text-white text-xs h-8 px-3 rounded-lg flex items-center gap-1.5 whitespace-nowrap shadow-sm cursor-pointer">
                            Options <DownOutlined className="text-[9px] text-zinc-500" />
                        </Button>
                    </Dropdown>
                ),
            };
        });
    }, [filteredRequests]);

    const coldata = [
        { 
            title: "Batch / Request Title", 
            dataIndex: "titleNode", 
            key: "titleNode",
            width: 250,
        },
        { 
            title: "Ingested At", 
            dataIndex: "createdAt", 
            key: "createdAt",
            width: 140,
            render: (text: string) => (
                <span className="text-xs text-zinc-400 font-mono whitespace-nowrap">
                    {text ? new Date(text).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                </span>
            )
        },
        { title: "Grievances Extracted", dataIndex: "documentsNode", key: "documentsNode", width: 170 },
        { title: "Status", dataIndex: "statusNode", key: "statusNode", width: 130 },
        { title: "Actions", dataIndex: "actionNode", key: "actionNode", width: 120 },
    ];

    const handleDelete = async (id: any) => {
        try {
            await axios.delete(`${backend_url}/requests/${id}`, { withCredentials: true });
            messageApi.success('Request deleted');
            fetch();
        } catch (err: any) {
            messageApi.error(err?.response?.data?.message || 'Failed to delete');
        }
    };

    const handlepreview = async (id: any) => {
        try {
            const ans = await axios.get(`${backend_url}/requests/${id}/preview`, { withCredentials: true });
            setIframeFile(ans.data.file_address);
            setIsFrame(true);
        } catch (err) {
            messageApi.error('Preview unavailable');
        }
    };

    const handlereport = async (id: any) => {
        setIsLoading(true);
        try {
            const ans = await axios.get(`${backend_url}/requests/${id}/report`, { withCredentials: true });
            if (ans.status === 200 || ans.status === 202) {
                await fetch();
                messageApi.success('AI processing pipeline dispatched');
            } else {
                messageApi.error('Failed to generate report');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                messageApi.error(error.response?.data?.message || 'AI service error');
            } else {
                messageApi.error('Failed to dispatch generation');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyse = (id: any) => {
        navigate(`/main/analyse/${id}`);
    };

    const showModal = () => {
        setModalOpen(true);
        form.resetFields();
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const form_data = new FormData();
            form_data.append('title', values.title);
            form_data.append('description', values.description);
            form_data.append('pdffile', values.pdffile[0].originFileObj);
            await axios.post(`${backend_url}/requests`, form_data, { withCredentials: true });
            form.resetFields();
            setModalOpen(false);
            fetch();
            messageApi.success('Document uploaded and queued!');
        } catch (errorInfo: any) {
            messageApi.error(errorInfo?.response?.data?.message || 'Validation failed');
        }
    };

    const onClose = () => {
        setModalOpen(false);
        form.resetFields();
    };

    return (
        <>
            {contextHolder}
            <MainAreaLayout
                title="Grievance Ingestion Center"
                description="Upload and analyze handwritten/typed public issue petitions using Multimodal Vision AI"
                loading={isLoading}
                extra={
                    <Button 
                        type="primary" 
                        onClick={showModal}
                        icon={<PlusOutlined />}
                        className="!bg-white !text-black hover:!bg-zinc-200 !border-none text-xs sm:text-sm font-bold h-9 sm:h-10 px-4 sm:px-5 rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                        Ingest New Document
                    </Button>
                }
            >
                <div className="space-y-6">
                    {/* Executive KPI Metrics Strip */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-2">
                                <span className="text-xs font-mono uppercase">Total Batches</span>
                                <DatabaseOutlined className="text-zinc-400 text-sm" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white">{rawRequests.length}</span>
                                <span className="text-[11px] text-zinc-400 font-mono">Active Records</span>
                            </div>
                        </div>

                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-2">
                                <span className="text-xs font-mono uppercase">Extracted Grievances</span>
                                <FileTextOutlined className="text-zinc-400 text-sm" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white">{totalDocs}</span>
                                <span className="text-[11px] text-zinc-400">Citizen Issues</span>
                            </div>
                        </div>

                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-2">
                                <span className="text-xs font-mono uppercase">Completed Analysis</span>
                                <CheckCircleOutlined className="text-emerald-400 text-sm" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white">{completedBatches}</span>
                                <span className="text-[11px] text-zinc-500 font-mono">/ {rawRequests.length} Ready</span>
                            </div>
                        </div>

                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between text-zinc-500 mb-2">
                                <span className="text-xs font-mono uppercase">AI Engine</span>
                                <ThunderboltOutlined className="text-white text-sm" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-bold text-zinc-200">Gemini 2.5</span>
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-medium">
                                    Operational
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filter Toolbar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#121214] border border-white/[0.08] rounded-2xl">
                        <div className="relative w-full sm:w-80">
                            <Input
                                placeholder="Search by batch title or description..."
                                prefix={<SearchOutlined className="text-zinc-500 mr-1 text-xs" />}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                allowClear
                                className="!bg-[#09090B] !border-white/[0.08] !text-zinc-100 !text-xs !h-9 !rounded-xl"
                            />
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="flex items-center gap-1 bg-[#09090B] p-1 rounded-xl border border-white/[0.06] w-full sm:w-auto">
                            {[
                                { key: 'all', label: 'All Batches' },
                                { key: 'complete', label: 'Completed' },
                                { key: 'pending', label: 'Pending' },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setStatusFilter(tab.key)}
                                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                                        statusFilter === tab.key
                                            ? 'bg-white text-black shadow-sm font-bold'
                                            : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Table */}
                    <CustomTable
                        columns={coldata}
                        data={tableData}
                        serialNumberConfig={{ show: true, name: "#" }}
                    />
                </div>
            </MainAreaLayout>

            {/* Ingest Document Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center text-sm font-bold">
                            ⚡
                        </div>
                        <span className="text-white font-bold text-base">Ingest New Grievance Batch</span>
                    </div>
                }
                open={ModalOpen}
                onOk={onOk}
                onCancel={onClose}
                okText="Upload & Queue"
                okButtonProps={{ className: "!bg-white !text-black hover:!bg-zinc-200 !border-none !rounded-xl !h-9 font-bold cursor-pointer" }}
                cancelButtonProps={{ className: "!bg-zinc-800 !text-zinc-300 !border-zinc-700 !rounded-xl !h-9 cursor-pointer" }}
                width={520}
                style={{ maxWidth: '95vw', top: 30 }}
            >
                <div className="p-3 mb-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                    Upload scanned handwritten or typed public grievances in PDF format. The OCR pipeline will extract and categorize citizen issues ward-wise.
                </div>
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={{ title: '', description: '' }}
                    requiredMark={false}
                    className="space-y-1"
                >
                    <Form.Item
                        label={<span className="text-zinc-300 font-medium text-xs">Batch Title</span>}
                        name="title"
                        rules={[{ required: true, message: 'Please enter batch title' }]}
                    >
                        <Input placeholder="e.g. Gram Panchayat Jan Sunwai - August 2026" className="!h-10 !rounded-xl" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-zinc-300 font-medium text-xs">Description & Context</span>}
                        name="description"
                        rules={[{ required: true, message: 'Please enter brief description' }]}
                    >
                        <Input.TextArea placeholder="Administrative context, ward coverage, or notes..." rows={3} className="!rounded-xl" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-zinc-300 font-medium text-xs">PDF Document</span>}
                        name="pdffile"
                        rules={[{ required: true, message: 'Please attach a PDF document' }]}
                        valuePropName="fileList"
                        getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                    >
                        <Upload 
                            beforeUpload={() => false}
                            accept="application/pdf"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />} className="!bg-[#09090B] !text-zinc-200 !border-zinc-700 !h-10 !rounded-xl hover:!border-white">
                                Select PDF File (Max 25MB)
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Document Preview Modal */}
            <Modal
                title={<span className="text-white font-bold text-base">Original Document Preview</span>}
                open={isIframe}
                onCancel={() => setIsFrame(false)}
                footer={null}
                width={850}
                style={{ maxWidth: '95vw', top: 20 }}
            >
                <div className="w-full h-[72vh] rounded-xl overflow-hidden border border-white/[0.08] bg-[#09090B]">
                    <iframe
                        src={iframeFile}
                        className="w-full h-full border-none"
                        title="Document Preview"
                    />
                </div>
            </Modal>
        </>
    );
};

export default RequestsPage_comp;