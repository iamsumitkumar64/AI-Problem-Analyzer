import React from 'react';
import axios from 'axios';
import backend_url from '../Libs/env';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Form, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';

const Register: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [registerForm] = Form.useForm();
    const navigate = useNavigate();

    const handleRegister = async (values: any) => {
        try {
            const { username, email, password } = values;
            let ans = await axios.post(`${backend_url}/register`, { username, email, password }, { withCredentials: true });
            if (ans?.status === 201 || ans?.data?.message === 'Registration Successful') {
                messageApi.success(ans.data.message || 'Registration Successful! Please login.');
                setTimeout(() => navigate('/login'), 1200);
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
            messageApi.error(errorMsg);
        }
    };

    return (
        <>
            {contextHolder}
            <div className="flex items-center justify-center min-h-screen bg-[#090D16] p-4 text-[#F8FAFC]">
                <div className="w-full max-w-md p-6 sm:p-8 bg-[#131B2E] border border-[#3B82F6]/20 shadow-2xl rounded-2xl max-h-[95vh] overflow-y-auto">
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] mb-2 text-2xl font-bold border border-[#3B82F6]/30">
                            🚀
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">Create Account</h2>
                        <p className="text-xs sm:text-sm text-[#F8FAFC]/60 mt-1">Join AI Problem Analyzer today</p>
                    </div>
                    
                    <Form
                        form={registerForm}
                        onFinish={handleRegister}
                        layout="vertical"
                        requiredMark={false}
                    >
                        <Form.Item
                            label={<span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">Username</span>}
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                            className="mb-3"
                        >
                            <Input
                                prefix={<UserOutlined className="text-[#3B82F6]" />}
                                placeholder="Enter your username"
                                className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30 hover:!border-[#3B82F6] focus:!border-[#3B82F6] h-10 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">Email</span>}
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Invalid email address!' },
                            ]}
                            className="mb-3"
                        >
                            <Input
                                prefix={<MailOutlined className="text-[#3B82F6]" />}
                                placeholder="Enter your email"
                                className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30 hover:!border-[#3B82F6] focus:!border-[#3B82F6] h-10 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">Password</span>}
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your password!' },
                                { min: 6, message: 'Password must be at least 6 characters!' }
                            ]}
                            className="mb-3"
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-[#3B82F6]" />}
                                placeholder="Enter your password"
                                className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30 hover:!border-[#3B82F6] focus:!border-[#3B82F6] h-10 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[#F8FAFC] font-medium text-xs sm:text-sm">Confirm Password</span>}
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
                            className="mb-4"
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-[#3B82F6]" />}
                                placeholder="Confirm your password"
                                className="!bg-[#090D16] !text-[#F8FAFC] !border-[#3B82F6]/30 hover:!border-[#3B82F6] focus:!border-[#3B82F6] h-10 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item className="mb-3">
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className="!bg-[#3B82F6] hover:!bg-[#2563EB] !border-none h-10 sm:h-11 text-sm font-semibold rounded-lg shadow-lg shadow-[#3B82F6]/25 transition-all"
                            >
                                Register
                            </Button>
                        </Form.Item>

                        <div className="text-center text-[#F8FAFC]/60 text-xs sm:text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#3B82F6] font-medium hover:underline">
                                Login here
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Register;
