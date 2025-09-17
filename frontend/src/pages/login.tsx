import React from 'react';
import axios from 'axios';
import backend_url from '../Libs/env';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Form, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const LoginSignup: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loginForm] = Form.useForm();
    const navigate = useNavigate();

    const handleLogin = async (values: any) => {
        try {
            let ans = await axios.post(`${backend_url}/login`, values, { withCredentials: true });
            if (ans?.data?.message === 'Login Success') {
                messageApi.loading(ans.data.message);
                setTimeout(() => navigate('/main'), 1000);
            }
        } catch (err: any) {
            console.log(err);
            messageApi.error(err.response.data.message);
        }
    };

    return (
        <>
            {contextHolder}
            <style>{`
                .ant-form-item-label > label {
                    color: white !important;
                }
            `}</style>

            <div className="rounded-es-full rounded-se-full flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-500 to-gray-800">
                <div className="w-full max-w-md p-8 bg-gray-900 shadow-lg rounded-lg">
                    <h2 className="text-3xl font-semibold text-center text-white mb-6">Welcome Back!</h2>
                    <Form
                        form={loginForm}
                        onFinish={handleLogin}
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Invalid email!' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: '#fff' }} />}
                                placeholder="Enter your email"
                                style={{ backgroundColor: '#444', color: '#fff' }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: '#fff' }} />}
                                placeholder="Enter your password"
                                style={{ backgroundColor: '#444', color: '#fff' }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                style={{ backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' }}
                            >
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default LoginSignup;