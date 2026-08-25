import React, { useState, useMemo } from 'react';
import { TagsOutlined, ArrowRightOutlined } from '@ant-design/icons';
import ProblemModal from '../ProblemModal/index.tsx';

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

const CommonProblem: React.FC<CommonProblemProps> = ({ data }) => {
    const [selectedTag, setSelectedTag] = useState<string>('');

    const tagAnalysis = useMemo(() => {
        if (!data || data.length === 0) return { entries: [], totalOccurrences: 0 };
        const counts: Record<string, number> = {};
        let total = 0;

        data.forEach(item => {
            (item.problems || []).forEach(problem => {
                (problem.tags || []).forEach(tag => {
                    counts[tag] = (counts[tag] || 0) + 1;
                    total += 1;
                });
            });
        });

        const entries = Object.entries(counts)
            .map(([tag, count]) => ({
                tag,
                count,
                percentage: total > 0 ? Math.round((count / total) * 100) : 0,
            }))
            .sort((a, b) => b.count - a.count);

        return { entries, totalOccurrences: total };
    }, [data]);

    if (!data || data.length === 0) {
        return <p className="text-zinc-500 text-center py-8">No category data available.</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                        Topic & Category Clusters
                    </h3>
                    <p className="text-xs text-zinc-400">
                        Click any sector to inspect citizen complaints tagged under that topic
                    </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700">
                    {tagAnalysis.entries.length} Sectors Detected
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagAnalysis.entries.map(({ tag, count, percentage }) => (
                    <div
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="p-4 bg-[#09090B] border border-white/[0.08] hover:border-white/[0.2] rounded-2xl cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-lg"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-sm text-white flex items-center gap-1.5 group-hover:underline transition-colors">
                                    <TagsOutlined className="text-zinc-400 text-xs" />
                                    #{tag}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-800 text-zinc-200 font-mono border border-zinc-700">
                                    {count} {count === 1 ? 'hit' : 'hits'}
                                </span>
                            </div>

                            {/* Frequency Bar */}
                            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden my-2 border border-zinc-800">
                                <div 
                                    className="h-full bg-white rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.max(percentage, 8)}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-white/[0.04] mt-2">
                            <span>{percentage}% of total issues</span>
                            <span className="flex items-center gap-1 text-white font-semibold group-hover:translate-x-1 transition-transform">
                                Explore <ArrowRightOutlined className="text-[9px]" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <ProblemModal filter={selectedTag} data={data} />
        </div>
    );
};

export default CommonProblem;