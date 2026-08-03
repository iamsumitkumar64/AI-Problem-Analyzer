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
            <style>{`
                .ant-form-item-label > label {
                    color: white !important;
                }
            `}</style>

            <div className="rounded-es-full rounded-se-full flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-500 to-gray-800">
                <div className="w-full max-w-md p-8 bg-gray-900 shadow-lg rounded-lg">
                    <h2 className="text-3xl font-semibold text-center text-white mb-2">Create an Account</h2>
                    <p className="text-sm text-gray-400 text-center mb-6">Join AI Problem Analyzer today</p>
                    
                    <Form
                        form={registerForm}
                        onFinish={handleRegister}
                        layout="vertical"
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: '#fff' }} />}
                                placeholder="Enter your username"
                                style={{ backgroundColor: '#444', color: '#fff' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Invalid email address!' },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined style={{ color: '#fff' }} />}
                                placeholder="Enter your email"
                                style={{ backgroundColor: '#444', color: '#fff' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your password!' },
                                { min: 6, message: 'Password must be at least 6 characters!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: '#fff' }} />}
                                placeholder="Enter your password"
                                style={{ backgroundColor: '#444', color: '#fff' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
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
                                prefix={<LockOutlined style={{ color: '#fff' }} />}
                                placeholder="Confirm your password"
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
                                Register
                            </Button>
                        </Form.Item>

                        <div className="text-center text-gray-400 text-sm mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:underline">
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
