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
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedTag, setSelectedTag] = useState<string>('');

    if (!data || data.length === 0) {
        messageApi.error('No data available');
        return <p>No data available</p>;
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
            <div style={{ padding: '1rem' }}>
                {tagEntries.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                        {tagEntries.map(({ tag, count }) => (
                            <p key={tag} className="py-3 px-4 flex text-white items-center bg-gray-700 rounded-2xl duration-300 hover:bg-blue-700 hover:scale-110" onClick={() => { setSelectedTag(tag) }}>
                                <strong> &#x25BA; </strong> {tag} (<strong className='text-yellow-300'> {count} </strong>)
                            </p>
                        ))}
                    </div>
                ) : (
                    <p>No tags found</p>
                )}
            </div>
            <ProblemModal filter={selectedTag} data={data} />
        </>
    );
}

export default CommonProblem;