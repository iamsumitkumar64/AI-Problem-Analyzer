import axios from 'axios';
import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import backend_url from '../Libs/env';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from '../components/sidebar';

const MainPage = () => {
    const [isEmail, setIsEmail] = useState<String>('');
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ans = await axios(backend_url, { withCredentials: true });
                if (ans?.data?.user?.email) {
                    setIsEmail(ans.data.user.email);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    // Check if sub-route is active
    const isSubRouteActive = location.pathname !== '/main' && location.pathname !== '/main/';

    return (
        <Layout className="min-h-screen bg-[#090D16] text-[#F8FAFC]">
            <SideBar email={isEmail}>
                {isSubRouteActive ? (
                    <Outlet />
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center text-3xl font-bold border border-[#3B82F6]/30 mb-4 shadow-lg shadow-[#3B82F6]/20">
                            ⚡
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mb-2">
                            AI Problem Analyzer
                        </h2>
                        <p className="text-sm text-[#F8FAFC]/60 max-w-md">
                            Select Requests or Users from the navigation menu to get started.
                        </p>
                    </div>
                )}
            </SideBar>
        </Layout>
    );
};

export default MainPage;