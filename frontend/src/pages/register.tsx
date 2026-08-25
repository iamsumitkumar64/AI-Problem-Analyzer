import React, { useState } from 'react';
import axios from 'axios';
import backend_url from '../Libs/env';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Form, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';

const Register: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [registerForm] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (values: any) => {
        setIsLoading(true);
        try {
            const { username, email, password } = values;
            let ans = await axios.post(`${backend_url}/register`, { username, email, password }, { withCredentials: true });
            if (ans?.status === 201 || ans?.data?.message === 'Registration Successful') {
                messageApi.success('Registration Successful! Please login.');
                setTimeout(() => navigate('/login'), 800);
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            messageApi.error(err.response?.data?.message || 'Registration failed.');
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
                            CIVICPULSE AI • REGISTRATION
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create Officer Account</h2>
                        <p className="text-xs sm:text-sm text-zinc-400 mt-1">Join the AI-powered grievance intelligence network</p>
                    </div>
                    
                    <Form
                        form={registerForm}
                        onFinish={handleRegister}
                        layout="vertical"
                        requiredMark={false}
                        className="space-y-2"
                    >
                        <Form.Item
                            label={<span className="text-zinc-300 font-medium text-xs">Officer Name</span>}
                            name="username"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-zinc-500 mr-1" />}
                                placeholder="e.g. Ramesh Chandra"
                                className="!h-11 !rounded-xl !bg-[#09090B] !border-white/[0.1] !text-white"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-zinc-300 font-medium text-xs">Official Email</span>}
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Invalid email address!' },
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
                            rules={[
                                { required: true, message: 'Please input your password!' },
                                { min: 6, message: 'Password must be at least 6 characters!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-zinc-500 mr-1" />}
                                placeholder="••••••••"
                                className="!h-11 !rounded-xl !bg-[#09090B] !border-white/[0.1] !text-white"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-zinc-300 font-medium text-xs">Confirm Password</span>}
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-zinc-500 mr-1" />}
                                placeholder="••••••••"
                                className="!h-11 !rounded-xl !bg-[#09090B] !border-white/[0.1] !text-white"
                            />
                        </Form.Item>

                        <div className="pt-3">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                block
                                className="!bg-white !text-black hover:!bg-zinc-200 !border-none !h-11 text-sm font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                            >
                                Register Officer Account
                            </Button>
                        </div>

                        <div className="flex items-center justify-between text-zinc-400 text-xs pt-3 border-t border-zinc-800 mt-2">
                            <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
                                ← Back to Home
                            </Link>
                            <Link to="/login" className="text-white font-semibold hover:underline">
                                Sign in here
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Register;
