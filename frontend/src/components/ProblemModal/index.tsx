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
                typeof filter === 'number' || !isNaN(Number(filter))
                    ? `Problems in Ward No "${filter}"`
                    : `Problems related to "${filter}"`
            }
            open={ModalOpen}
            onCancel={onClose}
            footer={'Made By Sumit Kumar'}
        >
            {filteredData && filteredData.length > 0 ? (
                filteredData.map((item) => (
                    <div key={item._id}>
                        <h3>{item.name}</h3>
                        <strong>Ward:</strong> {item.wardNo}
                        <p><strong>Mobile:</strong> {item.mobileNo}</p>
                        <ul className='py-5'>
                            {(typeof filter === 'string' && isNaN(Number(filter))
                                ? item.problems.filter(problem => problem.tags.includes(filter))
                                : item.problems
                            ).map(problem => (
                                <li key={problem._id}>
                                    &#x25BA;<strong>{problem.english}</strong> ({problem.hindi})
                                </li>
                            ))}
                        </ul>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No problems found for this {typeof filter === 'number' ? 'ward' : 'tag'}.</p>
            )}
        </Modal>
    );
};

export default ProblemModal;