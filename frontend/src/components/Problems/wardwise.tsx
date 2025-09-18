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
                data.map((item: DataInterface) => (
                    <div
                        key={item._id}
                        className="bg-gray-200 shadow-md rounded-xl p-6 mb-6 border border-gray-200 hover:shadow-lg transition-all"
                       onClick={() => {
    setSelectedWardNO(null); 
    setTimeout(() => setSelectedWardNO(parseInt(item.wardNo)), 0);
}}
                    >
                        <h2 className="text-2xl font-semibold text-indigo-700 mb-4 cursor-pointer">
                            🏷️ Ward No: {item.wardNo}
                        </h2>
                        <ul className="space-y-4">
                            {item.problems.map((problem) => (
                                <li
                                    key={problem._id}
                                    className="p-4 border bg-white border-gray-600 rounded-lg"
                                >
                                    {problem.english && (
                                        <p className="text-gray-800">
                                            <strong className="text-indigo-500">➤</strong> {problem.english}
                                        </p>
                                    )}
                                    {problem.hindi && (
                                        <p className="text-gray-700">
                                            <strong className="text-pink-500">➤</strong> {problem.hindi}
                                        </p>
                                    )}
                                    <div className="mt-2">
                                        <span className="text-sm font-semibold text-red-600 mr-2">
                                            Tags:
                                        </span>
                                        {problem.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-block bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded-full mr-2"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No problems found.</p>
            )}
            <ProblemModal filter={SelectedWardNO} data={data} />
        </>
    );
}

export default WardWiseProblem;