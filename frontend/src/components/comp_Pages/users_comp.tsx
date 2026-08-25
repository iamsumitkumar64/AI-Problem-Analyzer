import axios from 'axios';
import backend_url from '../../Libs/env.tsx';
import { useState, useEffect } from 'react';
import CustomTable from '../customtable/index.tsx';
import MainAreaLayout from '../main_area_layout/index.tsx';
import { Button, Drawer, Form, Input, message, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const UsersPage_comp = () => {
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);
    const [editUserId, setEditUserId] = useState<string | null>(null);
    const [usersData, setUsersData] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setisLoading] = useState<boolean>(false);

    const fetchusers = async () => {
        setisLoading(true);
        try {
            const response = await axios.get(`${backend_url}/users`, {
                withCredentials: true
            });
            if (!response || !response.data?.users) {
                messageApi.error('No users Exist');
                return;
            }
            const users = response.data.users.map((item: any) => {
                const userId = item.id || item._id;
                return {
                    ...item,
                    id: userId,
                    action: (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <Button 
                                type="text" 
                                icon={<EditOutlined className="text-[#3B82F6]" />}
                                onClick={() => handleEdit(item)}
                                className="!bg-[#3B82F6]/10 hover:!bg-[#3B82F6]/20 !text-[#3B82F6] h-8 text-xs font-medium rounded-lg"
                            >
                                Edit
                            </Button>
                            <Button 
                                type="text" 
                                icon={<DeleteOutlined className="text-red-400" />}
                                onClick={() => handleDelete(userId)}
                                className="!bg-red-500/10 hover:!bg-red-500/20 !text-red-400 h-8 text-xs font-medium rounded-lg"
                            >
                                Delete
                            </Button>
                        </div>
                    ),
                };
            });
            setUsersData(users);
        } catch (err) {
            console.log(err);
            messageApi.info('No user Exist');
        }
        finally {
            setTimeout(() => {
                setisLoading(false);
            }, 300);
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
            title: "Username", 
            dataIndex: "username", 
            key: "username",
            width: 180,
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="truncate max-w-[170px] font-semibold text-[#F8FAFC]">
                        {text}
                    </div>
                </Tooltip>
            )
        },
        { 
            title: "Email", 
            dataIndex: "email", 
            key: "email",
            width: 220,
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="truncate max-w-[210px] text-xs text-[#F8FAFC]/80">
                        {text}
                    </div>
                </Tooltip>
            )
        },
        { title: "Action", dataIndex: "action", key: "action", width: 140 }
    ];

    const User_button: React.FC = () => {
        return (
            <Button 
                type="primary" 
                onClick={showDrawer}
                icon={<PlusOutlined />}
                className="!bg-[#3B82F6] hover:!bg-[#2563EB] !border-none text-xs sm:text-sm font-medium h-9 px-4 rounded-lg shadow-md shadow-[#3B82F6]/20 flex items-center"
            >
                Add User
            </Button>
        );
    };

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
            console.log('Validation Failed:', errorInfo);
            messageApi.error(errorInfo?.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <>
            {contextHolder}
            <MainAreaLayout title="Users List" description="Manage sub-users and team accounts" loading={isLoading} extra={<User_button />}>
                <CustomTable columns={coldata} data={usersData} serialNumberConfig={{ show: true, name: "Sr." }} />
            </MainAreaLayout>
            <Drawer
                title={<span className="text-[#F8FAFC] font-semibold text-base">{isEdit ? "Edit User" : "Create User"}</span>}
                onClose={onClose}
                open={drawerOpen}
                className="!bg-[#131B2E] text-[#F8FAFC]"
                width={400}
                style={{ maxWidth: '90vw' }}
            >
                <div className="p-3 mb-4 rounded-lg bg-[#090D16] border border-[#3B82F6]/20 text-xs text-[#F8FAFC]/70">
                    <strong className="text-[#3B82F6]">Note:</strong> Email address must be unique across all system users.
                </div>
                <Form layout="vertical" form={form} requiredMark={false}>
                    <Form.Item label={<span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">Username</span>} name="username" rules={[
                        { required: true, message: 'Please enter username!' }]}>
                        <Input placeholder="Enter Username" className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30" />
                    </Form.Item>
                    <Form.Item label={<span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">Email</span>} name="email" rules={[
                        { required: true, message: 'Please enter your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}>
                        <Input placeholder="Enter User Email" type="email" className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30" />
                    </Form.Item>
                    <Button 
                        type="primary" 
                        onClick={handleUserCreation}
                        className="!bg-[#3B82F6] hover:!bg-[#2563EB] !border-none w-full h-10 mt-2 text-sm font-semibold rounded-lg shadow-lg shadow-[#3B82F6]/20"
                    >
                        {isEdit ? 'Update User' : 'Create User'}
                    </Button>
                </Form>
            </Drawer>
        </>
    );
}

export default UsersPage_comp;