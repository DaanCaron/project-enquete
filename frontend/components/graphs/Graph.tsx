import answerService from "@/services/answerService";
import { Answer } from "@/types";
import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import { BarChart } from '@mui/x-charts/BarChart';


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

    if (qid === 0) {
        return (
            <div className="bg-[#424242] h-screen text-white flex justify-center items-center text-5xl">
                <p>Wacht tot een enquete gestart word!</p>
            </div>
        );
    }


    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-[50%]">
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
                        },
                    ]}
                    height={300}
                />
            </div>
        </div>
    )
}

export default Graph