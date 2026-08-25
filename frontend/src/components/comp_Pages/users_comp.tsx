import axios from 'axios';
import backend_url from '../../Libs/env.tsx';
import { useState, useEffect } from 'react';
import CustomTable from '../customtable/index.tsx';
import MainAreaLayout from '../main_area_layout/index.tsx';
import { Button, Drawer, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const UsersPage_comp = () => {
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);
    const [editUserId, setEditUserId] = useState<string | null>(null);
    const [usersData, setUsersData] = useState<any[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setisLoading] = useState<boolean>(false);

    const fetchusers = async () => {
        setisLoading(true);
        try {
            const response = await axios.get(`${backend_url}/users`, {
                withCredentials: true
            });
            const list = response.data?.users || [];
            const users = list.map((item: any) => {
                const userId = item.id || item._id;
                return {
                    ...item,
                    id: userId,
                    userNode: (
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                                {item.username ? item.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-white">{item.username}</span>
                                <span className="text-[11px] text-zinc-500 font-mono">ID: {String(userId).slice(-6)}</span>
                            </div>
                        </div>
                    ),
                    emailNode: (
                        <span className="text-xs text-zinc-300 font-mono">
                            {item.email}
                        </span>
                    ),
                    roleNode: (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
                            Officer
                        </span>
                    ),
                    action: (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <Button 
                                type="text" 
                                icon={<EditOutlined className="text-zinc-300" />}
                                onClick={() => handleEdit(item)}
                                className="!bg-zinc-800 hover:!bg-zinc-700 !text-zinc-200 h-8 text-xs font-medium rounded-lg cursor-pointer"
                            >
                                Edit
                            </Button>
                            <Button 
                                type="text" 
                                icon={<DeleteOutlined className="text-rose-400" />}
                                onClick={() => handleDelete(userId)}
                                className="!bg-rose-500/10 hover:!bg-rose-500/20 !text-rose-400 h-8 text-xs font-medium rounded-lg cursor-pointer"
                            >
                                Delete
                            </Button>
                        </div>
                    ),
                };
            });
            setUsersData(users);
        } catch (err) {
            console.error('Fetch users error:', err);
        } finally {
            setTimeout(() => {
                setisLoading(false);
            }, 250);
        }
    };

    useEffect(() => {
        fetchusers();
    }, []);

    const showDrawer = () => {
        setDrawerOpen(true);
        setIsEdit(false);
        form.resetFields();
    };

    const onClose = () => {
        setDrawerOpen(false);
        setIsEdit(false);
        setEditUserId(null);
        form.resetFields();
    };

    const handleEdit = (userToEdit: any) => {
        setIsEdit(true);
        form.setFieldsValue({
            username: userToEdit.username,
            email: userToEdit.email,
        });
        setEditUserId(userToEdit.id || userToEdit._id);
        setDrawerOpen(true);
    };

    const handleDelete = async (id: any) => {
        try {
            await axios.delete(`${backend_url}/users/${id}`, {
                withCredentials: true
            });
            messageApi.success('User Deleted Successfully');
            fetchusers();
        } catch (err: any) {
            console.error('Delete failed:', err);
            messageApi.error(err?.response?.data?.message || 'Failed to delete user');
        }
    };

    const coldata = [
        { 
            title: "Officer / User", 
            dataIndex: "userNode", 
            key: "userNode",
            width: 220,
        },
        { 
            title: "Email Address", 
            dataIndex: "emailNode", 
            key: "emailNode",
            width: 240,
        },
        {
            title: "Access Role",
            dataIndex: "roleNode",
            key: "roleNode",
            width: 140,
        },
        { title: "Actions", dataIndex: "action", key: "action", width: 150 }
    ];

    const handleUserCreation = async () => {
        try {
            const values = await form.validateFields();
            if (isEdit && editUserId) {
                await axios.put(`${backend_url}/users/${editUserId}`, values, {
                    withCredentials: true
                });
                messageApi.success('User Updated Successfully');
            } else {
                await axios.post(`${backend_url}/users`, values, {
                    withCredentials: true
                });
                messageApi.success('User Created Successfully');
            }
            fetchusers();
            setDrawerOpen(false);
            form.resetFields();
            setIsEdit(false);
            setEditUserId(null);
        } catch (errorInfo: any) {
            messageApi.error(errorInfo?.response?.data?.message || 'Validation failed');
        }
    };

    return (
        <>
            {contextHolder}
            <MainAreaLayout 
                title="Officers & Team Members" 
                description="Manage administrative sub-users and civic department access" 
                loading={isLoading} 
                extra={
                    <Button 
                        type="primary" 
                        onClick={showDrawer}
                        icon={<PlusOutlined />}
                        className="!bg-white !text-black hover:!bg-zinc-200 !border-none text-xs sm:text-sm font-bold h-9 sm:h-10 px-4 sm:px-5 rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                        Add Officer
                    </Button>
                }
            >
                <div className="space-y-6">
                    {/* User KPI Stats Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center text-lg">
                                <TeamOutlined />
                            </div>
                            <div>
                                <p className="text-xs font-mono uppercase text-zinc-500">Total Officers</p>
                                <p className="text-2xl font-bold text-white">{usersData.length}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center text-lg">
                                <SafetyCertificateOutlined />
                            </div>
                            <div>
                                <p className="text-xs font-mono uppercase text-zinc-500">Access Level</p>
                                <p className="text-sm font-bold text-emerald-400">Staff</p>
                            </div>
                        </div>

                        <div className="p-4 bg-[#121214] border border-white/[0.08] rounded-2xl shadow-lg flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center text-lg">
                                <UserOutlined />
                            </div>
                            <div>
                                <p className="text-xs font-mono uppercase text-zinc-500">Session Auth</p>
                                <p className="text-sm font-bold text-zinc-300">JWT HTTP-Only</p>
                            </div>
                        </div>
                    </div>

                    <CustomTable columns={coldata} data={usersData} serialNumberConfig={{ show: true, name: "#" }} />
                </div>
            </MainAreaLayout>

            <Drawer
                title={
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-base">{isEdit ? "Update Officer Profile" : "Register New Officer"}</span>
                    </div>
                }
                onClose={onClose}
                open={drawerOpen}
                className="!bg-[#121214] text-white"
                width={420}
                style={{ maxWidth: '90vw' }}
            >
                <div className="p-3 mb-4 rounded-xl bg-[#09090B] border border-white/[0.06] text-xs text-zinc-400">
                    New officers receive portal access to review citizen grievances and export ward reports.
                </div>
                <Form layout="vertical" form={form} requiredMark={false} className="space-y-2">
                    <Form.Item 
                        label={<span className="text-zinc-300 font-medium text-xs">Officer Full Name</span>} 
                        name="username" 
                        rules={[{ required: true, message: 'Please enter username' }]}
                    >
                        <Input placeholder="e.g. Ramesh Chandra" className="!h-10 !rounded-xl" />
                    </Form.Item>
                    <Form.Item 
                        label={<span className="text-zinc-300 font-medium text-xs">Official Email Address</span>} 
                        name="email" 
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input placeholder="e.g. officer@panchayat.gov.in" type="email" className="!h-10 !rounded-xl" />
                    </Form.Item>
                    <Button 
                        type="primary" 
                        onClick={handleUserCreation}
                        className="!bg-white !text-black hover:!bg-zinc-200 !border-none w-full !h-11 mt-4 text-sm font-bold rounded-xl shadow-lg cursor-pointer"
                    >
                        {isEdit ? 'Save Changes' : 'Register Officer'}
                    </Button>
                </Form>
            </Drawer>
        </>
    );
}

export default UsersPage_comp;