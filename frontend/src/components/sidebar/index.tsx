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
        w-full flex items-center gap-3 px-3.5 py-2.5 my-1 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer group
        ${isPathActive(path) 
            ? 'bg-white text-black shadow-md font-bold' 
            : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'}
    `;

    const userInitial = (email || 'U').charAt(0).toUpperCase();

    return (
        <Layout className="min-h-screen bg-[#09090B] flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar for Desktop / Tablet */}
            <Sider
                breakpoint="md"
                collapsedWidth="64"
                className="!bg-[#121214] border-r border-white/[0.08] !w-full md:!w-64 flex-shrink-0"
            >
                <Flex vertical justify="space-between" className="h-full p-3 sm:p-4">
                    <div>
                        {/* App Logo / Brand */}
                        <div className="flex items-center gap-3 px-2 py-3 mb-5 border-b border-white/[0.08]">
                            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black text-base shadow-sm flex-shrink-0">
                                ⚡
                            </div>
                            <div className="hidden sm:flex flex-col min-w-0">
                                <span className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5 truncate">
                                    CivicPulse AI
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono border border-zinc-700">
                                        PRO
                                    </span>
                                </span>
                                <span className="text-[11px] text-zinc-500 truncate">
                                    Grievance Intelligence
                                </span>
                            </div>
                        </div>

                        {/* Navigation Section */}
                        <div className="mb-2 px-2 hidden sm:block">
                            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                                Management
                            </span>
                        </div>
                        <nav className="space-y-1">
                            <div 
                                className={navItemClass('/main/requests')} 
                                onClick={() => navigate('/main/requests')}
                            >
                                <FileTextOutlined className="text-base flex-shrink-0" />
                                <span className="hidden sm:inline flex-1">Grievance Requests</span>
                            </div>
                            <div 
                                className={navItemClass('/main/users')} 
                                onClick={() => navigate('/main/users')}
                            >
                                <UserOutlined className="text-base flex-shrink-0" />
                                <span className="hidden sm:inline flex-1">Team & Users</span>
                            </div>
                        </nav>
                    </div>

                    {/* User Profile Capsule & Logout */}
                    <div className="border-t border-white/[0.08] pt-4 mt-auto space-y-3">
                        <div className="hidden sm:flex items-center gap-3 p-2.5 rounded-xl bg-[#09090B] border border-white/[0.06]">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {userInitial}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-zinc-200 truncate" title={email as string}>
                                    {email ? String(email).split('@')[0] : 'Admin'}
                                </p>
                                <p className="text-[11px] text-zinc-500 truncate" title={email as string}>
                                    {email || 'user@system.local'}
                                </p>
                            </div>
                        </div>

                        <button 
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/20 transition-all text-xs font-medium cursor-pointer"
                            onClick={() => navigate('/logout')}
                        >
                            <LogoutOutlined />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </Flex>
            </Sider>

            {/* Main Content Area */}
            <Layout className="!bg-[#09090B] flex-1 overflow-y-auto min-h-0">
                {children}
            </Layout>
        </Layout>
    );
};

export default SideBar;