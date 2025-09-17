import { useState, useEffect } from 'react';
import CustomTable from '../customtable/index.tsx';
import MainAreaLayout from '../main_area_layout/index.tsx';
import { Button, Modal, Form, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import backend_url from '../../Libs/env.tsx';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { DownCircleOutlined } from '@ant-design/icons';

const RequestsPage_comp = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [isdata, setIsdata] = useState([]);
    const [isIframe, setIsFrame] = useState<boolean>(false);
    const [iframeFile, setIframeFile] = useState<String>('');
    const navigate = useNavigate();

    const actionMenu = (item: any) => (
        <Menu className='text-center'>
            <Menu.Item key="delete" onClick={() => handleDelete(item.id)} className='hover:!bg-red-500 hover:font-bold'>
                ❌ Delete
            </Menu.Item>
            <Menu.Item key="preview" onClick={() => handlepreview(item.id)} className='hover:!bg-blue-500'>
                👁️ Preview
            </Menu.Item>
            {!item.documents ? (
                <Menu.Item key="report" onClick={() => handlereport(item.id)} className='hover:!bg-yellow-500'>
                    ✨ Generate Report
                </Menu.Item>
            ) : (
                <Menu.Item key="analyse" onClick={() => handleAnalyse(item.id)} className='hover:!bg-yellow-500'>
                    ✨ Analyse Report
                </Menu.Item>
            )}
        </Menu>
    );

    const fetch = async () => {
        setIsLoading(true);
        try {
            const ans = await axios.get(`${backend_url}/request`, { withCredentials: true });
            const requests = ans.data.data.map((item: any) => ({
                ...item,
                documents: (
                    <Link to={`/main/report/${item.id}`} className='text-blue-500 text-1xl font-bold'>{item.documents}</Link>
                ),
                action: (
                    // <div>
                    //     <Button type='primary' className='mx-2 my-2' ghost onClick={() => handleDelete(item.id)}>&#x274C;</Button>
                    //     <Button type='primary' className='mx-2 my-2' ghost onClick={() => handlepreview(item.id)}>&#128064;</Button>
                    //     {!item.documents ?
                    //         <Button type='primary' className='mx-2 my-2' ghost onClick={() => handlereport(item.id)}>&#10024;</Button>
                    //         :
                    //         <Button type='primary' className='mx-2 my-2' ghost onClick={() => handleAnalyse(item.id)}>&#10024;</Button>
                    //     }
                    // </div>
                    <Dropdown overlay={actionMenu(item)} trigger={['click']}>
                        <Button>
                            Actions <DownCircleOutlined />
                        </Button>
                    </Dropdown>
                ),
            }));
            setIsdata(requests);
        } catch (err) {
            console.log(err);
        }
        finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 300)
        }
    };
    useEffect(() => {
        fetch();
    }, []);

    const coldata = [
        { title: "Title", dataIndex: "title", key: "title" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "CreadtedAt", dataIndex: "createdAt", key: "createdAt" },
        { title: "Documents", dataIndex: "documents", key: "documents" },
        { title: "Status", dataIndex: "status", key: "status" },
        { title: "Action", dataIndex: "action", key: "action" },
    ];
    const handleDelete = async (id: any) => {
        await axios.delete(`${backend_url}/request/${id}`, { withCredentials: true });
        fetch();
    };

    const handlepreview = async (id: any) => {
        const ans = await axios.get(`${backend_url}/request/preview/${id}`, { withCredentials: true });
        setIframeFile(ans.data.file_address);
        setIsFrame(true);
    };

    const handlereport = async (id: any) => {
        setIsLoading(true);
        try {
            const ans = await axios.get(`${backend_url}/request/report/${id}`, { withCredentials: true });
            if (ans.status === 200) {
                await fetch();
                messageApi.success('Report generated successfully');
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
        // messageApi.info(id);
        setIsLoading(true);
        setTimeout(() => {
            navigate(`/main/anlayse/${id}`);
        }, 700);
    };

    const showModal = () => {
        setModalOpen(true);
        form.resetFields();
    };

    const User_button: React.FC = () => (
        <Button type="primary" onClick={showModal}>
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
            await axios.post(`${backend_url}/request`, form_data, { withCredentials: true });
            form.resetFields();
            setModalOpen(false);
            fetch();
            messageApi.success('Request created successfully!');
        } catch (errorInfo: any) {
            messageApi.error(errorInfo?.response?.data?.message);
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
                title="Requests's List"
                description="Analyse Your Request's Using AI"
                loading={isLoading}
                extra={<User_button />}
            >
                <CustomTable
                    columns={coldata}
                    data={isdata}
                    serialNumberConfig={{ show: true, name: "Sr. No." }}
                />
            </MainAreaLayout>
            <Modal
                title="Create Request"
                open={ModalOpen}
                onOk={onOk}
                onCancel={onClose}
            >
                <Form
                    layout='vertical'
                    form={form}
                    initialValues={{ title: '', description: '' }}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please enter title!' }]}
                    >
                        <Input placeholder="Enter title" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter description' }]}
                    >
                        <Input.TextArea placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item
                        label="PDF File"
                        name="pdffile"
                        rules={[{ required: true, message: 'Please upload a PDF file!' }]}
                        valuePropName="fileList"
                        getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                    >
                        <Upload beforeUpload={() => false}
                            accept="application/pdf"
                            maxCount={1}>
                            <Button icon={<UploadOutlined />}>
                                <strong>Select Request PDF</strong>
                                <br />
                            </Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Preview File"
                open={isIframe}
                onCancel={onCloseIframe}
                footer={'Made By Sumit Kumar'}
                width={800}
                style={{ top: 0 }}
            >
                <iframe
                    src={iframeFile as string}
                    style={{ width: '100%', height: '78vh' }}
                    title="PDF Preview"
                ></iframe>
            </Modal>
        </>
    );
};

export default RequestsPage_comp;