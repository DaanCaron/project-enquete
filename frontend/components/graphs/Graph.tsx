import answerService from "@/services/answerService";
import { Answer } from "@/types";
import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import * as React from 'react';
import {
    GaugeContainer,
    GaugeValueArc,
    GaugeReferenceArc,
    useGaugeState,
} from '@mui/x-charts/Gauge';
import { BarChart } from "@mui/x-charts";
import MiddleFillGauge from "./MiddleGauge";


const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);

const Graph: React.FC = () => {
    const [qid, setQid] = useState(0)
    const qidRef = useRef(0);

    const [graphStyle, setGraphStyle] = useState<string>("")

    const [state, setState] = useState<boolean>(false)
    const [answers, setAnswers] = useState<Answer[] | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [counts, setCounts] = useState<number[]>([]);
    const [avg, setAvg] = useState<number>(50)
    

    useEffect(() => {
        const selectGraph = (gid: number, graphStyle: string, state: boolean) => {
            setQid(gid)
            setState(state)
            setGraphStyle(graphStyle)
            qidRef.current = gid;
            console.log(gid, graphStyle, state)
        }

        socket.on('selectGraph', selectGraph)

        return () => {
            socket.off('selectGraph', selectGraph)
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (qidRef.current !== 0) {
                fetchAllAnswersByQuestionId(qidRef.current)
            }
        }, 500);

        return () => clearInterval(interval);
    }, [state, qid, graphStyle]);

    let allWeights = []
    let total = 0
    const fetchAllAnswersByQuestionId = async (qid: number) => {
        allWeights = []
        total = 0
        if (state) {
            try {
                const res = await answerService.getAllAnswersByQuestionId(qid)

                if (res.ok) {
                    const ansData = await res.json()
                    if (graphStyle === 'hist') {
                        console.log("did this")
                        const uniqueCategories = [...new Set(ansData.map((answer: Answer) => answer.answer))] as string[];

                        const categoryCounts = uniqueCategories.map(
                            (cat) => ansData.filter((a: Answer) => a.answer === cat).length
                        );

                        setCategories(uniqueCategories);
                        setCounts(categoryCounts);
                        setAnswers(ansData)
                    }
                    else if (graphStyle === 'gauge') {
                        for(let i = 0; i < ansData.length; i++){
                            allWeights.push(ansData[i].weight)
                            total += ansData[i].weight
                        }

                        if(allWeights.length === 0 ){
                            setAvg(50)
                            return
                        }
                        //console.log(allWeights, total, 100 * allWeights.length
                        setAvg((total / (100 * allWeights.length)) * 100)
                    }
                }
            } catch (error) {

            }
        }
    }

 const GaugePointer = () => {
        const { valueAngle, outerRadius, cx, cy } = useGaugeState();
        if (valueAngle === null) return null;
        const target = {
            x: cx + outerRadius * Math.sin(valueAngle),
            y: cy - outerRadius * Math.cos(valueAngle),
        };
        return (
            <g>
                <circle cx={cx} cy={cy} r={5} fill="#FF5252" />
                <path
                    d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
                    stroke="#FF5252"
                    strokeWidth={3}
                />
            </g>
        );
    };

    if (qid === 0) {
        return <div className="bg-[#424242] h-screen text-white flex justify-center items-center text-5xl"></div>;
    }

    return (
        <div className="w-full h-full flex justify-center items-center p-6 bg-[#2c2c2c]">
            {!state || (
                <div className="w-full max-w-3xl bg-[#1f1f1f] p-6 rounded-2xl shadow-lg">
                    {graphStyle === "hist" && (
                        <BarChart
                            xAxis={[
                                {
                                    id: 'barCategories',
                                    data: categories,
                                    scaleType: 'band',
                                    label: "Antwoorden",
                                },
                            ]}
                            series={[
                                {
                                    data: counts,
                                    label: "Aantal stemmen",
                                    color: "#7198f5",
                                },
                            ]}
                            height={350}
                            margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
                            sx={{
                                '& .MuiChartsAxis-root': { stroke: '#ccc' },
                                '& .MuiChartsAxis-tickLabel': { fill: '#eee', fontSize: 14 },
                                '& .MuiChartsLegend-root': { fill: '#fff' },
                            }}
                        />
                    )}
                    {graphStyle === 'gauge' && (
                        <div className="flex justify-center">
                            {/* <GaugeContainer
                                width={250}
                                height={250}
                                startAngle={-90}
                                endAngle={90}
                                value={avg}
                                cornerRadius={5}
                            >
                                <GaugeReferenceArc />
                                <GaugeValueArc />
                                <GaugePointer />
                            </GaugeContainer> */}
                            <MiddleFillGauge value={avg} />
{Math.round(avg)}/100
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Graph;