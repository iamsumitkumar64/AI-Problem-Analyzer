import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import backend_url from '../Libs/env';
import { 
    FilePdfOutlined, 
    PictureOutlined, 
    EyeOutlined, 
    DatabaseOutlined, 
    ArrowRightOutlined, 
    UserOutlined,
    EnvironmentOutlined,
    TagsOutlined,
    BarChartOutlined,
    LogoutOutlined
} from '@ant-design/icons';

const HomePage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${backend_url}/session`, { withCredentials: true });
                if (res?.data?.user?.email) {
                    setIsLoggedIn(true);
                    setUserEmail(res.data.user.email);
                }
            } catch (err) {
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
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
            setIsLoggedIn(false);
            setUserEmail('');
        }
    };

    return (
        <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] selection:bg-white selection:text-black">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090B]/90 border-b border-white/[0.08]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 rounded-lg bg-white text-black font-black flex items-center justify-center text-sm shadow-sm">
                            ⚡
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-bold text-base tracking-tight text-white">CivicPulse AI</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
                        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-white transition-colors">Dashboard Features</a>
                        <a href="#example" className="hover:text-white transition-colors">Example Output</a>
                    </nav>

                    {/* Auth Status & CTAs */}
                    <div className="flex items-center gap-3">
                        {!loading && (
                            isLoggedIn ? (
                                <div className="flex items-center gap-2.5">
                                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#121214] border border-zinc-800 text-xs text-zinc-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        <span className="font-mono truncate max-w-[140px]">{userEmail}</span>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/main/requests')}
                                        className="h-9 px-4 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                                    >
                                        Go to Dashboard <ArrowRightOutlined className="text-[10px]" />
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        title="Sign Out"
                                        className="h-9 w-9 rounded-xl bg-[#121214] hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                                    >
                                        <LogoutOutlined />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link 
                                        to="/login"
                                        className="h-9 px-3.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent transition-all flex items-center"
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        to="/register"
                                        className="h-9 px-4 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1 shadow-sm"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-16 pb-14 sm:pt-24 sm:pb-20 border-b border-white/[0.06] overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
                    {/* Simple badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
                        <span className="w-2 h-2 rounded-full bg-white" />
                        Handwritten Complaint Analyzer
                    </div>

                    {/* Main Title */}
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Read & Organize Handwritten Citizen Complaints Using AI
                    </h1>

                    {/* Clear, simple explanation */}
                    <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Upload scanned PDF files containing handwritten or typed complaint letters from villagers. The system reads the handwriting in Hindi or English, extracts the citizen's details, and organizes all problems by ward and category.
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        {isLoggedIn ? (
                            <button
                                onClick={() => navigate('/main/requests')}
                                className="h-11 px-6 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                            >
                                Open My Dashboard <ArrowRightOutlined className="text-xs" />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="h-11 px-6 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                                >
                                    Sign In to Portal <ArrowRightOutlined className="text-xs" />
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="h-11 px-6 rounded-xl bg-[#121214] hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-sm border border-zinc-800 transition-all cursor-pointer"
                                >
                                    Create New Account
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* How It Works (Step by Step Pipeline) */}
            <section id="how-it-works" className="py-16 sm:py-20 border-b border-white/[0.06] bg-[#0C0C0E]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">How This Project Really Works</h2>
                        <p className="text-xs sm:text-sm text-zinc-400">
                            Here is the exact step-by-step process of how your uploaded PDF is read and converted into structured reports:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Step 1 */}
                        <div className="p-5 bg-[#121214] border border-zinc-800 rounded-2xl space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white font-bold text-xs flex items-center justify-center">
                                    1
                                </div>
                                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                                    <FilePdfOutlined className="text-zinc-400" /> You Upload a PDF Document
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                You upload a scanned PDF file containing one or more handwritten or typed grievance letters collected from citizens (e.g. from Jan Sunwai or Gram Panchayat meetings).
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="p-5 bg-[#121214] border border-zinc-800 rounded-2xl space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white font-bold text-xs flex items-center justify-center">
                                    2
                                </div>
                                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                                    <PictureOutlined className="text-zinc-400" /> PDF is Converted to Images
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                The server uses <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded font-mono text-[11px]">pdftoppm</code> to automatically split each page of your PDF into high-resolution PNG image files.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="p-5 bg-[#121214] border border-zinc-800 rounded-2xl space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white font-bold text-xs flex items-center justify-center">
                                    3
                                </div>
                                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                                    <EyeOutlined className="text-zinc-400" /> Gemini Vision AI Reads the Handwriting
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Each page image is sent to Google's Gemini Vision model. It reads the handwritten Hindi or English text and extracts the exact problem written by the citizen.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="p-5 bg-[#121214] border border-zinc-800 rounded-2xl space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white font-bold text-xs flex items-center justify-center">
                                    4
                                </div>
                                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                                    <DatabaseOutlined className="text-zinc-400" /> Saved into MongoDB Database
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                The AI extracts the Person's Name, Phone Number, Ward Number, Problem in English + Hindi, and Topic Tags. This data is saved into MongoDB, and the frontend updates in real-time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Example of Extracted Data */}
            <section id="example" className="py-16 sm:py-20 border-b border-white/[0.06]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">What Details Does It Fetch For You?</h2>
                        <p className="text-xs sm:text-sm text-zinc-400">
                            Here is an actual example showing the raw handwritten letter on the left and the exact details fetched by the AI on the right:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#121214] border border-zinc-800 rounded-2xl">
                        {/* Left: Input */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-zinc-800">
                                <span className="text-zinc-400">Input: Citizen's Handwritten Letter</span>
                                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Hindi</span>
                            </div>
                            <div className="p-4 bg-[#09090B] rounded-xl border border-dashed border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                                "सेवा में, श्रीमान सरपंच महोदय। ग्राम पंचायत वार्ड नं. 3 में पिछले 15 दिनों से पीने के पानी की मुख्य पाइपलाइन टूटी हुई है। इसके अलावा रात को स्ट्रीट लाइट बंद रहने से चोरी का डर बना रहता है। कृपया समाधान करें। - रामेश्वर लाल (मो. 9829012345)"
                            </div>
                        </div>

                        {/* Right: Extracted Output */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-zinc-800">
                                <span className="text-white font-bold">Fetched Output by AI</span>
                                <span className="px-2 py-0.5 rounded bg-white text-black font-bold text-[10px]">Extracted</span>
                            </div>
                            <div className="space-y-2 text-xs bg-[#09090B] p-4 rounded-xl border border-zinc-800">
                                <div className="flex justify-between py-1 border-b border-zinc-900">
                                    <span className="text-zinc-500">Citizen Name:</span>
                                    <span className="font-bold text-white">Rameshwar Lal (रामेश्वर लाल)</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-zinc-900">
                                    <span className="text-zinc-500">Ward Number:</span>
                                    <span className="font-bold text-white">Ward 3</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-zinc-900">
                                    <span className="text-zinc-500">Mobile Number:</span>
                                    <span className="font-mono text-zinc-300">+91 9829012345</span>
                                </div>
                                <div className="py-1 border-b border-zinc-900">
                                    <span className="text-zinc-500 block mb-1">Identified Tags:</span>
                                    <div className="flex flex-wrap gap-1">
                                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">#Drinking Water</span>
                                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">#Electricity</span>
                                    </div>
                                </div>
                                <div className="pt-1 text-[11px] text-zinc-300 leading-relaxed">
                                    <span className="text-white font-bold">English Summary:</span> Broken main drinking water supply pipeline in Ward 3 for past 15 days; non-functional streetlights at night.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real Dashboard Features */}
            <section id="features" className="py-16 sm:py-20 border-b border-white/[0.06] bg-[#0C0C0E]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Real Features Available in This App</h2>
                        <p className="text-xs sm:text-sm text-zinc-400">
                            Everything built and working on your dashboard:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-5 bg-[#121214] border border-zinc-800 rounded-xl space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-sm font-bold">
                                <UserOutlined />
                            </div>
                            <h3 className="font-bold text-sm text-white">All Citizens List</h3>
                            <p className="text-xs text-zinc-400">
                                Browse all extracted citizen complaints in a clean table. Search quickly by citizen name, phone number, ward, or topic.
                            </p>
                        </div>

                        <div className="p-5 bg-[#121214] border border-zinc-800 rounded-xl space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-sm font-bold">
                                <EnvironmentOutlined />
                            </div>
                            <h3 className="font-bold text-sm text-white">Ward-Wise Grouping</h3>
                            <p className="text-xs text-zinc-400">
                                Automatically groups complaints by Ward number (e.g. Ward 1, Ward 2, Ward 3) so you know which ward has the most problems.
                            </p>
                        </div>

                        <div className="p-5 bg-[#121214] border border-zinc-800 rounded-xl space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-sm font-bold">
                                <TagsOutlined />
                            </div>
                            <h3 className="font-bold text-sm text-white">Category Breakdown</h3>
                            <p className="text-xs text-zinc-400">
                                Click on any category tag (like #Water, #Roads, or #Electricity) to instantly filter and see all affected villagers.
                            </p>
                        </div>

                        <div className="p-5 bg-[#121214] border border-zinc-800 rounded-xl space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-sm font-bold">
                                <BarChartOutlined />
                            </div>
                            <h3 className="font-bold text-sm text-white">Bar & Pie Charts</h3>
                            <p className="text-xs text-zinc-400">
                                View interactive bar charts of citizen complaints and click on any bar to open a pie chart of their problem categories.
                            </p>
                        </div>

                        <div className="p-5 bg-[#121214] border border-zinc-800 rounded-xl space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-sm font-bold">
                                🇮🇳
                            </div>
                            <h3 className="font-bold text-sm text-white">Hindi & English Text</h3>
                            <p className="text-xs text-zinc-400">
                                View the original Hindi complaint written by the villager side-by-side with the English translation generated by AI.
                            </p>
                        </div>

                        <div className="p-5 bg-[#121214] border border-zinc-800 rounded-xl space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center text-sm font-bold">
                                👥
                            </div>
                            <h3 className="font-bold text-sm text-white">Officer Accounts</h3>
                            <p className="text-xs text-zinc-400">
                                Create officer accounts so your team members can log in, view complaints, and analyze reports.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="py-16 sm:py-20 border-b border-white/[0.06] text-center">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        Ready to start analyzing petitions?
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400">
                        Sign in to your account or register a new officer to upload and review citizen grievance documents.
                    </p>
                    <div className="pt-2">
                        {isLoggedIn ? (
                            <button
                                onClick={() => navigate('/main/requests')}
                                className="h-11 px-8 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all shadow-lg cursor-pointer"
                            >
                                Open Dashboard
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="h-11 px-8 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all shadow-lg cursor-pointer"
                            >
                                Sign In to Portal
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-[#09090B] text-zinc-500 text-xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white">CivicPulse AI</span>
                        <span>•</span>
                        <span>Built with Node.js, Gemini Vision, MongoDB & React</span>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-400">
                        <span className="text-emerald-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            System Active
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
