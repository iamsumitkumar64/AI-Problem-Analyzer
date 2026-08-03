import React from 'react';
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

const WardWiseProblem: React.FC<CommonProblemProps> = ({ data }) => {
    const [SelectedWardNO, setSelectedWardNO] = useState<number | null>(null);

    return (
        <>
            {data && data.length > 0 ? (
                <div className="space-y-4">
                    {data.map((item: DataInterface) => (
                        <div
                            key={item._id}
                            className="bg-[#090D16] border border-[#3B82F6]/20 rounded-xl p-4 sm:p-5 shadow-lg hover:border-[#3B82F6]/50 transition-all cursor-pointer"
                            onClick={() => {
                                setSelectedWardNO(null); 
                                setTimeout(() => setSelectedWardNO(parseInt(item.wardNo)), 0);
                            }}
                        >
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#3B82F6]/15">
                                <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
                                    <span className="text-[#3B82F6]">📍</span> Ward No: {item.wardNo}
                                </h3>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] font-semibold border border-[#3B82F6]/30">
                                    {item.problems.length} Issues
                                </span>
                            </div>

                            <ul className="space-y-3">
                                {item.problems.map((problem) => (
                                    <li
                                        key={problem._id}
                                        className="p-3 sm:p-4 bg-[#131B2E] border border-[#3B82F6]/15 rounded-lg space-y-2 text-xs sm:text-sm"
                                    >
                                        {problem.english && (
                                            <p className="text-[#F8FAFC]">
                                                <strong className="text-[#3B82F6] mr-1">➤</strong> {problem.english}
                                            </p>
                                        )}
                                        {problem.hindi && (
                                            <p className="text-[#F8FAFC]/90">
                                                <strong className="text-[#3B82F6] mr-1">➤</strong> {problem.hindi}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            <span className="text-xs font-semibold text-[#F8FAFC]/50 mr-1">Tags:</span>
                                            {problem.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/25"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-[#F8FAFC]/50 py-6">No problems found.</p>
            )}
            <ProblemModal filter={SelectedWardNO} data={data} />
        </>
    );
};

export default WardWiseProblem;