import { Layout, Flex } from "antd";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileTextOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Sider } = Layout;
type SideBarProps = { children: ReactNode, email: String };

const SideBar: React.FC<SideBarProps> = ({ children, email }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isPathActive = (path: string) => location.pathname.startsWith(path);

    const navItemClass = (path: string) => `
        w-full flex items-center gap-3 px-3 py-2.5 my-1 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer
        ${isPathActive(path) 
            ? 'bg-[#3B82F6] text-[#F8FAFC] shadow-lg shadow-[#3B82F6]/30 font-semibold' 
            : 'text-[#F8FAFC]/70 hover:bg-[#3B82F6]/10 hover:text-[#F8FAFC]'}
    `;

    return (
        <Layout className="min-h-screen bg-[#090D16] flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar for Desktop / Tablet */}
            <Sider
                breakpoint="md"
                collapsedWidth="60"
                className="!bg-[#131B2E] border-r border-[#3B82F6]/15 !w-full md:!w-64 flex-shrink-0"
            >
                <Flex vertical justify="space-between" className="h-full p-3 sm:p-4">
                    <div>
                        {/* App Logo / Brand */}
                        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-[#3B82F6]/10">
                            <div className="w-8 h-8 rounded-lg bg-[#3B82F6] text-[#F8FAFC] flex items-center justify-center font-bold text-base shadow-md shadow-[#3B82F6]/30">
                                AI
                            </div>
                            <span className="hidden sm:inline font-bold text-base text-[#F8FAFC] tracking-tight">
                                Problem Analyzer
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <nav className="space-y-1">
                            <div 
                                className={navItemClass('/main/requests')} 
                                onClick={() => navigate('/main/requests')}
                            >
                                <FileTextOutlined className="text-base" />
                                <span className="hidden sm:inline">Requests</span>
                            </div>
                            <div 
                                className={navItemClass('/main/users')} 
                                onClick={() => navigate('/main/users')}
                            >
                                <UserOutlined className="text-base" />
                                <span className="hidden sm:inline">Users</span>
                            </div>
                        </nav>
                    </div>

                    {/* User Profile & Logout */}
                    <div className="border-t border-[#3B82F6]/10 pt-4 mt-auto">
                        <div className="hidden sm:block px-3 py-2 mb-2 rounded-lg bg-[#090D16] border border-[#3B82F6]/15 text-center">
                            <p className="text-xs text-[#F8FAFC]/50 truncate">Logged in as</p>
                            <p className="text-xs font-semibold text-[#F8FAFC] truncate" title={email as string}>
                                {email || 'User'}
                            </p>
                        </div>
                        <button 
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#090D16] text-[#F8FAFC]/80 hover:text-[#F8FAFC] hover:bg-[#3B82F6]/20 border border-[#3B82F6]/20 transition-all text-xs sm:text-sm font-medium"
                            onClick={() => navigate('/logout')}
                        >
                            <LogoutOutlined />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </Flex>
            </Sider>

            {/* Main Content Area */}
            <Layout className="!bg-[#090D16] flex-1 overflow-y-auto min-h-0">
                {children}
            </Layout>
        </Layout>
    );
};

export default SideBar;