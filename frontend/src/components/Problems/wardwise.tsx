import React, { useMemo } from 'react';
import { EnvironmentOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';

interface ProblemInterface {
    tags: string[];
    english: string;
    hindi: string;
    _id: string;
}

interface DataInterface {
    mobileNo: number;
    name: string;
    numberOfProblems: number;
    wardNo: string;
    problems: ProblemInterface[];
    _id: string;
}

interface CommonProblemProps {
    data: DataInterface[] | null;
}

interface WardGroup {
    wardNo: string;
    citizens: DataInterface[];
    totalProblems: number;
    allTags: string[];
}

const WardWiseProblem: React.FC<CommonProblemProps> = ({ data }) => {
    // Group all submissions by Ward Number
    const wardGroups: WardGroup[] = useMemo(() => {
        if (!data || data.length === 0) return [];
        const groups: Record<string, WardGroup> = {};

        data.forEach(item => {
            const ward = String(item.wardNo || '1');
            if (!groups[ward]) {
                groups[ward] = {
                    wardNo: ward,
                    citizens: [],
                    totalProblems: 0,
                    allTags: [],
                };
            }
            groups[ward].citizens.push(item);
            groups[ward].totalProblems += (item.problems ? item.problems.length : (item.numberOfProblems || 1));
            (item.problems || []).forEach(p => {
                (p.tags || []).forEach(t => {
                    if (!groups[ward].allTags.includes(t)) {
                        groups[ward].allTags.push(t);
                    }
                });
            });
        });

        // Sort by ward number numerically if possible
        return Object.values(groups).sort((a, b) => {
            const numA = parseInt(a.wardNo, 10);
            const numB = parseInt(b.wardNo, 10);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.wardNo.localeCompare(b.wardNo);
        });
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="py-12 text-center text-zinc-500">
                <EnvironmentOutlined className="text-3xl mb-2 text-zinc-600" />
                <p>No ward data available to analyze.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                        Administrative Ward Analysis
                    </h3>
                    <p className="text-xs text-zinc-400">
                        Aggregated public issues across {wardGroups.length} wards
                    </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700">
                    {wardGroups.length} Active Wards
                </span>
            </div>

            <div className="grid grid-cols-1 gap-5">
                {wardGroups.map((ward) => (
                    <div
                        key={ward.wardNo}
                        className="bg-[#09090B] border border-white/[0.08] hover:border-white/[0.2] rounded-2xl p-5 shadow-xl transition-all"
                    >
                        {/* Ward Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-base shadow-sm">
                                    <EnvironmentOutlined />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                                        Ward No. {ward.wardNo}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                                        <span className="flex items-center gap-1">
                                            <UserOutlined className="text-[10px]" /> {ward.citizens.length} {ward.citizens.length === 1 ? 'Citizen' : 'Citizens'}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-zinc-200 font-medium">
                                            <FileTextOutlined className="text-[10px]" /> {ward.totalProblems} Reported Issues
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Ward Tags */}
                            <div className="flex flex-wrap gap-1 max-w-md">
                                {ward.allTags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Citizens and their problems in this ward */}
                        <div className="space-y-3">
                            {ward.citizens.map((citizen) => (
                                <div
                                    key={citizen._id}
                                    className="p-4 bg-[#121214] border border-white/[0.06] rounded-xl space-y-2.5"
                                >
                                    <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.04]">
                                        <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                                            <UserOutlined className="text-zinc-400 text-xs" />
                                            {citizen.name}
                                        </span>
                                        <span className="font-mono text-zinc-500 text-[11px]">
                                            {citizen.mobileNo ? `+91 ${citizen.mobileNo}` : ''}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {citizen.problems.map((prob) => (
                                            <div
                                                key={prob._id}
                                                className="p-3 bg-[#09090B] rounded-lg border border-white/[0.04] text-xs space-y-1.5"
                                            >
                                                {prob.english && (
                                                    <p className="text-zinc-200 leading-relaxed">
                                                        <span className="text-white font-bold mr-1">EN:</span>
                                                        {prob.english}
                                                    </p>
                                                )}
                                                {prob.hindi && (
                                                    <p className="text-zinc-400 leading-relaxed font-normal">
                                                        <span className="text-zinc-300 font-bold mr-1">HI:</span>
                                                        {prob.hindi}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {prob.tags.map((t, idx) => (
                                                        <span key={idx} className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-300 font-mono border border-zinc-700">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WardWiseProblem;