import React from 'react';
import axios from 'axios';
import backend_url from '../Libs/env';
import { useNavigate, Link } from 'react-router-dom';
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
            messageApi.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <>
            {contextHolder}
            <div className="flex items-center justify-center min-h-screen bg-[#090D16] p-4 text-[#F8FAFC]">
                <div className="w-full max-w-md p-6 sm:p-8 bg-[#131B2E] border border-[#3B82F6]/20 shadow-2xl rounded-2xl max-h-[95vh] overflow-y-auto">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] mb-3 text-2xl font-bold border border-[#3B82F6]/30">
                            ⚡
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">Welcome Back</h2>
                        <p className="text-xs sm:text-sm text-[#F8FAFC]/60 mt-1">AI Problem Analyzer System</p>
                    </div>

                    <Form
                        form={loginForm}
                        onFinish={handleLogin}
                        layout="vertical"
                        requiredMark={false}
                    >
                        <Form.Item
                            label={<span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">Email</span>}
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Invalid email!' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-[#3B82F6]" />}
                                placeholder="Enter your email"
                                className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30 hover:!border-[#3B82F6] focus:!border-[#3B82F6] h-10 sm:h-11 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">Password</span>}
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-[#3B82F6]" />}
                                placeholder="Enter your password"
                                className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30 hover:!border-[#3B82F6] focus:!border-[#3B82F6] h-10 sm:h-11 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item className="mt-6 mb-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className="!bg-[#3B82F6] hover:!bg-[#2563EB] !border-none h-10 sm:h-11 text-sm font-semibold rounded-lg shadow-lg shadow-[#3B82F6]/25 transition-all"
                            >
                                Login
                            </Button>
                        </Form.Item>

                        <div className="text-center text-[#F8FAFC]/60 text-xs sm:text-sm mt-4">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#3B82F6] font-medium hover:underline">
                                Register here
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default LoginSignup;