import axios from 'axios';
import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import backend_url from '../Libs/env.tsx';
import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar';

const MainPage = () => {
    const [isEmail, setIsEmail] = useState<String>('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const ans = await axios(backend_url, { withCredentials: true });
                setIsEmail(ans.data.user.email);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <Layout style={{ height: '100vh' }}>
            <SideBar email={isEmail}>
                <Outlet />
                <h2 className="m-auto text-red-400 font-bold text-2xl">&#128401; One Click Away &#128401;</h2>
            </SideBar>
        </Layout>
    );
};

export default MainPage;