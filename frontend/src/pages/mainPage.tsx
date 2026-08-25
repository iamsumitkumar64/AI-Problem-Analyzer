import axios from 'axios';
import { useEffect, useState } from 'react';
import backend_url from '../Libs/env';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
    FileTextOutlined, 
    UserOutlined, 
    LogoutOutlined, 
    GlobalOutlined
} from '@ant-design/icons';

const MainPage = () => {
    const [userEmail, setUserEmail] = useState<string>('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const ans = await axios.get(`${backend_url}/session`, { withCredentials: true });
                if (ans?.data?.user?.email) {
                    setUserEmail(ans.data.user.email);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchSession();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${backend_url}/logout`, {}, { withCredentials: true });
        } catch (err) {
            try {
                await axios.get(`${backend_url}/logout`, { withCredentials: true });
            } catch (e) {
                console.error('Logout error:', e);
            }
        } finally {
            setUserEmail('');
            navigate('/login', { replace: true });
        }
    };

    const isRequestsActive = location.pathname.startsWith('/main/requests') || location.pathname.startsWith('/main/report') || location.pathname.startsWith('/main/analyse') || location.pathname.startsWith('/main/analyze');
    const isUsersActive = location.pathname.startsWith('/main/users');

    return (
        <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-white selection:text-black">
            {/* Top Navigation Command Bar */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090B]/90 border-b border-white/[0.08]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Left: Brand Monogram & Navigation Tabs */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-white text-black font-black flex items-center justify-center text-sm shadow-sm group-hover:bg-zinc-200 transition-colors">
                                ⚡
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="font-bold text-sm tracking-tight text-white">CIVICPULSE</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                                    PRO
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Tabs */}
                        <nav className="hidden sm:flex items-center gap-1 bg-[#121214] p-1 rounded-xl border border-white/[0.06]">
                            <Link
                                to="/main/requests"
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                                    isRequestsActive
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                <FileTextOutlined className="text-xs" />
                                <span>Grievance Batches</span>
                            </Link>

                            <Link
                                to="/main/users"
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                                    isUsersActive
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                <UserOutlined className="text-xs" />
                                <span>Officers & Team</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Right: Quick Portal Link, User Monogram & Logout */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
                        >
                            <GlobalOutlined className="text-xs" />
                            <span>Public Portal</span>
                        </Link>

                        {/* User Identity Capsule */}
                        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#121214] border border-zinc-800 text-xs">
                                <div className="w-6 h-6 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-[10px]">
                                    {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <span className="font-mono text-zinc-300 hidden sm:inline max-w-[130px] truncate">
                                    {userEmail || 'admin'}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                title="Sign Out"
                                className="h-8 w-8 rounded-lg bg-[#121214] hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                            >
                                <LogoutOutlined />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Sub-bar */}
                <div className="sm:hidden flex items-center justify-around px-4 py-2 border-t border-zinc-800/80 bg-[#0C0C0E]">
                    <Link
                        to="/main/requests"
                        className={`text-xs font-semibold py-1 px-3 rounded-lg ${isRequestsActive ? 'bg-white text-black' : 'text-zinc-400'}`}
                    >
                        Grievances
                    </Link>
                    <Link
                        to="/main/users"
                        className={`text-xs font-semibold py-1 px-3 rounded-lg ${isUsersActive ? 'bg-white text-black' : 'text-zinc-400'}`}
                    >
                        Officers
                    </Link>
                    <Link
                        to="/"
                        className="text-xs font-medium py-1 px-3 text-zinc-400"
                    >
                        Portal
                    </Link>
                </div>
            </header>

            {/* Main Application Container Canvas */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainPage;