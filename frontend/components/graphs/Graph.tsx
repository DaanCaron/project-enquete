import answerService from "@/services/answerService";
import { Answer } from "@/types";
import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);

const Graph: React.FC = () => {
    const [qid, setQid] = useState(0)
    const qidRef = useRef(0);
    const [answers, setAnswers] = useState<Answer[] | null>(null)
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
                console.log(ansData)
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
        <div>
            {answers && answers.map((answer, idx) => (
                <div key={idx}>{JSON.stringify(answer)}</div>
            ))}
        </div>
    )
}

export default Graph