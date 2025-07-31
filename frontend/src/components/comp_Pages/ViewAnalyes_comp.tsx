import MainAreaLayout from '../main_area_layout/index.tsx';
import { Button } from 'antd';
import { useState, useEffect } from 'react';
import backend_url from '../../Libs/env.tsx';
import axios from 'axios';
import CommonProblem from '../Problems/common.tsx';
import WardWiseProblem from '../Problems/wardwise.tsx';
import ChartANalyse from '../Chart-Pie/Chart.tsx';

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

const ViewAnalyes_comp = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isData, setIsData] = useState<DataInterface[] | null>(null);
    const [selectedButton, setSelectedButton] = useState<string>('analyses');

    const fetch = async () => {
        setIsLoading(true);
        try {
            const reqId = window.location.pathname.split('/')[3];
            const ans = await axios.get(`${backend_url}/report/${reqId}`, {
                withCredentials: true
            });
            setIsData(ans.data.data.reportData);
        } catch (err) {
            console.log(err);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const handleClick = (buttonId: string) => {
        setSelectedButton(buttonId);
    };

    const getButtonStyle = (buttonId: string) => ({
        backgroundColor: selectedButton === buttonId ? 'royalblue' : '',
        color: selectedButton === buttonId ? 'white' : '',
        borderColor: selectedButton === buttonId ? 'blue' : '',
        marginLeft: '1.5vmax'
    });
    return (
        <>
            <MainAreaLayout
                title="AI Analyse Result"
                description="Analyse Your Request's Using AI"
                loading={isLoading}
            >
                <Button
                    style={getButtonStyle('common')}
                    onClick={() => handleClick('common')}
                >
                    Common Problem
                </Button>
                <Button
                    style={getButtonStyle('ward')}
                    onClick={() => handleClick('ward')}
                >
                    Ward Wise
                </Button>
                <Button
                    style={getButtonStyle('analyses')}
                    onClick={() => handleClick('analyses')}
                >
                    Pie Chart Analyse
                </Button>
                {
                    selectedButton == 'common' &&
                    <CommonProblem data={isData} />
                }
                {
                    selectedButton == 'ward' &&
                    <WardWiseProblem data={isData} />
                }
                {
                    selectedButton == 'analyses' &&
                    <ChartANalyse datas={isData} />
                }
            </MainAreaLayout>
        </>
    );
};

export default ViewAnalyes_comp;