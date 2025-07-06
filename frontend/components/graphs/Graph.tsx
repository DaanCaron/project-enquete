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


const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);

const Graph: React.FC = () => {
    const [qid, setQid] = useState(0)
    const qidRef = useRef(0);

    const [answers, setAnswers] = useState<Answer[] | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [counts, setCounts] = useState<number[]>([]);

    useEffect(() => {
        const selectGraph = (gid: number) => {
            setQid(gid)
            qidRef.current = gid;
            console.log(gid)
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
    }, []);

    const fetchAllAnswersByQuestionId = async (qid: number) => {
        try {
            const res = await answerService.getAllAnswersByQuestionId(qid)

            if (res.ok) {
                const ansData = await res.json()

                const uniqueCategories = [...new Set(ansData.map((answer: Answer) => answer.answer))] as string[];

                const categoryCounts = uniqueCategories.map(
                    (cat) => ansData.filter((a: Answer) => a.answer === cat).length
                );

                setCategories(uniqueCategories);
                setCounts(categoryCounts);
                setAnswers(ansData)
            }
        } catch (error) {

        }
    }

    const GaugePointer = () => {
        const { valueAngle, outerRadius, cx, cy } = useGaugeState();

        if (valueAngle === null) {
            return null;
        }

        const target = {
            x: cx + outerRadius * Math.sin(valueAngle),
            y: cy - outerRadius * Math.cos(valueAngle),
        };
        return (
            < g >
                <circle cx={cx} cy={cy} r={5} fill="red" />
                <path
                    d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
                    stroke="red"
                    strokeWidth={3}
                />
            </g >
        );
    }

    if (qid === 0) {
        return (
            <div className="bg-[#424242] h-screen text-white flex justify-center items-center text-5xl">
            </div>
        );
    }


    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-[50%]">
                <GaugeContainer
                    width={200}
                    height={200}
                    startAngle={-110}
                    endAngle={110}
                    value={50}
                >
                    <GaugeReferenceArc />
                    <GaugePointer />
                </GaugeContainer>

            </div>
        </div>
    )
}

export default Graph