import React from 'react';
import { message } from 'antd';
import { useState } from 'react';
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
    const [, contextHolder] = message.useMessage();
    const [selectedTag, setSelectedTag] = useState<string>('');

    if (!data || data.length === 0) {
        return <p className="text-[#F8FAFC]/50 text-center py-6">No data available</p>;
    }

    const tagCount: { [key: string]: number } = {};
    data.forEach(item => {
        item.problems.forEach(problem => {
            problem.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        });
    });

    const tagEntries = Object.entries(tagCount).map(([tag, count]) => ({ tag, count }));

    return (
        <>
            {contextHolder}
            <div className="py-2">
                {tagEntries.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {tagEntries.map(({ tag, count }) => (
                            <button
                                key={tag} 
                                className="py-2.5 px-4 flex items-center gap-2 bg-[#090D16] text-[#F8FAFC] border border-[#3B82F6]/30 rounded-xl text-xs sm:text-sm font-medium transition-all hover:bg-[#3B82F6]/20 hover:border-[#3B82F6] hover:scale-105 shadow-md cursor-pointer"
                                onClick={() => setSelectedTag(tag)}
                            >
                                <span className="text-[#3B82F6]">▶</span> 
                                <span>{tag}</span> 
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#3B82F6] text-[#F8FAFC] ml-1">
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-[#F8FAFC]/50">No tags found</p>
                )}
            </div>
            <ProblemModal filter={selectedTag} data={data} />
        </>
    );
};

export default CommonProblem;