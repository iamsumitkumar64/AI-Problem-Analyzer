import React from 'react';
import axios from 'axios';
import backend_url from '../Libs/env';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Form, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

const LoginSignup: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loginForm] = Form.useForm();
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();

    const handleLogin = async (values: any) => {
        setIsLoading(true);
        try {
            const ans = await axios.post(`${backend_url}/login`, values, { withCredentials: true });
            if (ans?.status === 200 || ans?.data?.message === 'Login Success') {
                messageApi.success('Welcome back!');
                setTimeout(() => navigate('/main'), 400);
            }
        } catch (err: any) {
            console.error('Login error:', err);
            messageApi.error(err.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <div className="flex items-center justify-center min-h-screen bg-[#09090B] p-4 text-[#FAFAFA] relative overflow-hidden">
                <div className="w-full max-w-md p-6 sm:p-8 bg-[#121214] border border-white/[0.08] shadow-2xl rounded-3xl relative z-10">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono mb-3">
                            <span className="w-2 h-2 rounded-full bg-white" />
                            CIVICPULSE AI • OFFICER PORTAL
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Portal Sign In</h2>
                        <p className="text-xs sm:text-sm text-zinc-400 mt-1">AI-Powered Public Grievance & Ward Intelligence</p>
                    </div>

                    <Form
                        form={loginForm}
                        onFinish={handleLogin}
                        layout="vertical"
                        requiredMark={false}
                        className="space-y-3"
                    >
                        <Form.Item
                            label={<span className="text-zinc-300 font-medium text-xs">Official Email</span>}
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Invalid email format!' },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-zinc-500 mr-1" />}
                                placeholder="name@panchayat.gov.in"
                                className="!h-11 !rounded-xl !bg-[#09090B] !border-white/[0.1] !text-white"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-zinc-300 font-medium text-xs">Password</span>}
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-zinc-500 mr-1" />}
                                placeholder="••••••••"
                                className="!h-11 !rounded-xl !bg-[#09090B] !border-white/[0.1] !text-white"
                            />
                        </Form.Item>

                        <div className="pt-2">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                block
                                className="!bg-white !text-black hover:!bg-zinc-200 !border-none !h-11 text-sm font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                            >
                                Authenticate & Enter
                            </Button>
                        </div>

                        <div className="flex items-center justify-between text-zinc-400 text-xs mt-4 pt-2 border-t border-zinc-800">
                            <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
                                ← Back to Home
                            </Link>
                            <Link to="/register" className="text-white font-semibold hover:underline">
                                Register Officer
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default LoginSignup;