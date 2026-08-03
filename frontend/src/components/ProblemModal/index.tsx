import { Modal } from 'antd';
import { useState, useEffect } from 'react';

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
            return item.wardNo === String(filter);
        } else if (typeof filter === 'string') {
            return item.problems.some(problem => problem.tags.includes(filter));
        }
        return false;
    });

    const onClose = () => {
        setModalOpen(false);
    };

    return (
        <Modal
            title={
                <span className="text-[#F8FAFC] font-semibold text-lg">
                    {typeof filter === 'number' || !isNaN(Number(filter))
                        ? `Problems in Ward "${filter}"`
                        : `Problems tagged with "${filter}"`}
                </span>
            }
            open={ModalOpen}
            onCancel={onClose}
            footer={null}
            className="!bg-[#131B2E]"
        >
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {filteredData && filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <div key={item._id} className="p-4 bg-[#090D16] border border-[#3B82F6]/20 rounded-xl space-y-2">
                            <div className="flex items-center justify-between border-b border-[#3B82F6]/15 pb-2">
                                <h4 className="font-bold text-[#F8FAFC] text-sm">{item.name}</h4>
                                <span className="text-xs px-2 py-0.5 rounded-md bg-[#3B82F6]/10 text-[#3B82F6] font-medium border border-[#3B82F6]/25">
                                    Ward {item.wardNo}
                                </span>
                            </div>
                            <p className="text-xs text-[#F8FAFC]/60">
                                <strong>Mobile:</strong> {item.mobileNo}
                            </p>
                            <ul className="space-y-2 pt-2">
                                {(typeof filter === 'string' && isNaN(Number(filter))
                                    ? item.problems.filter(problem => problem.tags.includes(filter))
                                    : item.problems
                                ).map(problem => (
                                    <li key={problem._id} className="text-xs sm:text-sm text-[#F8FAFC] bg-[#131B2E] p-2.5 rounded-lg border border-[#3B82F6]/10">
                                        <span className="text-[#3B82F6] font-bold mr-1.5">▶</span>
                                        <strong>{problem.english}</strong> 
                                        {problem.hindi && <span className="text-[#F8FAFC]/70 ml-1">({problem.hindi})</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-[#F8FAFC]/50 py-4 text-sm">
                        No problems found for this {typeof filter === 'number' ? 'ward' : 'tag'}.
                    </p>
                )}
            </div>
        </Modal>
    );
};

export default ProblemModal;