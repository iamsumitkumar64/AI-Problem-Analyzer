import { Layout, Flex } from "antd";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

const { Sider } = Layout;
type SideBarProps = { children: ReactNode, email: String };

const SideBar: React.FC<SideBarProps> = ({ children, email }) => {
    const navigate = useNavigate();
    const buttonCSS = `w-full text-white bg-blue-800
    hover:bg-white border border-transparent
    hover:text-blue-900 rounded-md px-4 py-2 my-1
    text-sm font-semibold text-center
    transition duration-200 shadow-sm hover:shadow-md focus:outline-none
    focus:ring-2 focus:ring-white`;

    return (
        <Layout style={{ minHeight: '100%'}}>
            <Sider
                className="w-1/4 flex flex-col justify-between p-2"
            >
                <Flex vertical justify="space-between" className="h-full">
                    <div className="flex flex-col ">
                        <button className={buttonCSS} onClick={() => navigate('/main/requests')}>Requests</button>
                        <button className={buttonCSS} onClick={() => navigate('/main/users')}>Users</button>
                    </div>
                    <div className="text-center">
                        <p className="text-blue-900 font-bold mb-2 bg-white rounded-full">{email}</p>
                        <button className={buttonCSS} onClick={() => navigate('/logout')}>Log Out</button>
                    </div>
                </Flex>
            </Sider>
            <Layout className="bg-gray-800 w-3/4">
                {children}
            </Layout>
        </Layout>
    );
};

export default SideBar;