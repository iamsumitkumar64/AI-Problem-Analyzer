import { Modal } from 'antd';
import { useState, useEffect } from 'react';
import { UserOutlined, TagsOutlined, EnvironmentOutlined } from '@ant-design/icons';

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

interface TagProps {
    filter: string | number | null | "" | undefined;
    data: DataInterface[] | null;
}

const ProblemModal: React.FC<TagProps> = ({ filter, data }) => {
    const [ModalOpen, setModalOpen] = useState<boolean>();

    useEffect(() => {
        if (filter !== undefined && filter !== null && filter !== "") {
            setModalOpen(true);
        }
    }, [filter]);

    const filteredData = data?.filter(item => {
        if (typeof filter === 'number' || !isNaN(Number(filter))) {
            return String(item.wardNo) === String(filter);
        } else if (typeof filter === 'string') {
            return (item.problems || []).some(problem => (problem.tags || []).includes(filter));
        }
        return false;
    });

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    {typeof filter === 'number' || !isNaN(Number(filter)) ? (
                        <EnvironmentOutlined className="text-zinc-400" />
                    ) : (
                        <TagsOutlined className="text-zinc-400" />
                    )}
                    <span className="text-white font-bold text-base">
                        {typeof filter === 'number' || !isNaN(Number(filter))
                            ? `Ward ${filter} Petitions`
                            : `Sector: #${filter}`}
                    </span>
                </div>
            }
            open={ModalOpen}
            onCancel={() => setModalOpen(false)}
            footer={null}
            width={580}
            style={{ maxWidth: '95vw', top: 30 }}
        >
            <div className="space-y-3.5 max-h-[62vh] overflow-y-auto pr-1">
                {filteredData && filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <div key={item._id} className="p-4 bg-[#09090B] border border-white/[0.08] rounded-xl space-y-2.5 shadow-sm">
                            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                                <span className="font-bold text-white text-sm flex items-center gap-1.5">
                                    <UserOutlined className="text-zinc-400 text-xs" />
                                    {item.name}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 font-mono border border-zinc-700">
                                    Ward {item.wardNo}
                                </span>
                            </div>
                            <p className="text-[11px] text-zinc-500 font-mono">
                                Contact: {item.mobileNo ? `+91 ${item.mobileNo}` : 'Unlisted'}
                            </p>
                            <div className="space-y-2 pt-1">
                                {(typeof filter === 'string' && isNaN(Number(filter))
                                    ? item.problems.filter(problem => (problem.tags || []).includes(filter))
                                    : item.problems
                                ).map(problem => (
                                    <div key={problem._id} className="p-2.5 rounded-lg bg-[#121214] border border-white/[0.04] text-xs space-y-1">
                                        {problem.english && (
                                            <p className="text-zinc-200">
                                                <span className="text-white font-bold mr-1">EN:</span>
                                                {problem.english}
                                            </p>
                                        )}
                                        {problem.hindi && (
                                            <p className="text-zinc-400">
                                                <span className="text-zinc-300 font-bold mr-1">HI:</span>
                                                {problem.hindi}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-zinc-500 py-6 text-sm">
                        No matching grievances found for this filter.
                    </p>
                )}
            </div>
        </Modal>
    );
};

export default ProblemModal;