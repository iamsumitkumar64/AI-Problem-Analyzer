import axios from 'axios';
import backend_url from '../../Libs/env.tsx';
import { useState, useEffect } from 'react';
import CustomTable from '../customtable/index.tsx';
import MainAreaLayout from '../main_area_layout/index.tsx';
import { Button, Drawer, Form, Input, message } from 'antd';

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
            let response = await axios.get(`${backend_url}/user`, {
                withCredentials: true
            });
            if (!response) {
                messageApi.error('No users Exist');
                return;
            }
            const users = response.data.users.map((item: any) => ({
                ...item,
                action: (
                    <div>
                        <Button type='primary' className='mx-2 my-2' onClick={() => handleEdit(item)}>Edit</Button>
                        <Button type='primary' className='mx-2 my-2' danger onClick={() => handleDelete(item.id)}>Delete</Button>
                    </div>
                ),
            }));
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
        setEditUserId(userToEdit.id);
        setDrawerOpen(true);
    };

    const handleDelete = async (id: any) => {
        await axios.delete(`${backend_url}/user`, {
            headers: { id },
            withCredentials: true
        });
        fetchusers();
    };

    const coldata = [
        { title: "Username", dataIndex: "username", key: "username", },
        { title: "Email", dataIndex: "email", key: "email", },
        { title: "Action", dataIndex: "action", key: "action", }
    ];

    const User_button: React.FC = () => {
        return (
            <Button type="primary" onClick={showDrawer}>
                Add User
            </Button>
        );
    };

    const handleUserCreation = async () => {
        try {
            const values = await form.validateFields();
            if (isEdit && editUserId) {
                const id = editUserId;
                await axios.put(`${backend_url}/user`, { headers: values, id }, {
                    withCredentials: true
                });
                messageApi.success('User Updated Successfully');
            } else {
                await axios.post(`${backend_url}/user`, values, {
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
            <MainAreaLayout title="User's List" description="Can Interact with users" loading={isLoading} extra={<User_button />}>
                <CustomTable columns={coldata} data={usersData} serialNumberConfig={{ show: true, name: "Sr. No." }} />
            </MainAreaLayout>
            <Drawer
                title={isEdit ? "Edit User" : "Create User"}
                onClose={onClose}
                open={drawerOpen}
            >
                <div className='my-4'>
                    <strong>Note:</strong>
                    <ul>
                        <li>Email Should be Unique</li>
                    </ul>
                </div>
                <Form layout='vertical' form={form} initialValues={{ userName: '', userEmail: '' }}>
                    <Form.Item label="UserName" name="username" rules={[
                        { required: true, message: 'Please enter username!' }]}>
                        <Input placeholder="Enter UserName" />
                    </Form.Item>
                    <Form.Item label="User Email" name="email" rules={[
                        { required: true, message: 'Please enter your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}>
                        <Input placeholder="Enter User Email" type='email' />
                    </Form.Item>
                    <Button type="primary" onClick={handleUserCreation}>
                        {isEdit ? 'Update User' : 'Create User'}
                    </Button>
                </Form>
            </Drawer>
        </>
    );
}

export default UsersPage_comp;