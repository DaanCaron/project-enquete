import { useEffect, useRef, useState } from "react"
import questionService from "../../services/QuestionService"
import { QuestionData } from "../../types"
import { io } from 'socket.io-client';


const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);


const Question: React.FC = () => {
    const [question, setQuestion] = useState<QuestionData | null>(null)
    const sequence = useRef(1)
    const survey = useRef(0)

    useEffect(() => {
        if(survey.current === 0){return}
        const nextquestion = () => {
            sequence.current += 1;
            fetchQuestionBySequenceAndSurvey(sequence.current, survey.current);
        };

        const prevQuestion = () => {
            if (sequence.current > 1) {
                sequence.current -= 1;
                fetchQuestionBySequenceAndSurvey(sequence.current, survey.current);
            }
        };

        const updateQuestion = () => {
            console.log("ws connected sucesful")
            fetchQuestionBySequenceAndSurvey(sequence.current, survey.current);
        }

        socket.on('nextQuestion', nextquestion);
        socket.on('prevQuestion', prevQuestion);
        socket.on('updateQuestion', updateQuestion);

        fetchQuestionBySequenceAndSurvey(sequence.current, survey.current);

        return () => {
            socket.off('nextQuestion', nextquestion);
            socket.off('prevQuestion', prevQuestion);
            socket.off('updateQuestion', updateQuestion);
        };
    }, []);


    const fetchQuestionBySequenceAndSurvey = async (sequence: number, survey: number) => {
        try {
            const res = await questionService.getQuestionBySequenceAndSurveyId(sequence, survey)
            if (res.ok) {
                console.log("ran this")
                const questionData = await res.json()
                setQuestion(questionData)
            }

        } catch (error) {
            console.error("Failed to connect to server to get qusetion.");
        }
    }
    if(survey.current === 0){
        return (
            <div className="bg-[#424242] h-screen text-white flex justify-center items-center text-5xl">
                <p>Wacht tot een enquete gestart word!</p>
            </div>
        );
    }
    else if (!question) {
        return (
            <div className="bg-[#424242] h-screen text-white flex justify-center items-center text-5xl">
                <p>Wacht tot een vraag geselecteerd word!</p>
            </div>
        );
    }

    const { window } = question;

    const getBoxFontSize = (height: number, width: number): string => {
        const scale = Math.min(width, height) * 0.3
        return `${Math.max(scale, 10)}px`
    }

    const getHoverClass = (text: string) => {
        if (text === "Yes" || text === "Ja") return "hover:bg-green-200";
        if (text === "No" || text === "Nee") return "hover:bg-red-200";
        return "hover:bg-blue-200";
    };

    const castVote = async (vote: string) => {
        try {
            const res = await questionService.castVote(question.id, vote)
            if (res.ok) {
                const ansData = await res.json()
                console.log(ansData)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div
            className="h-screen w-screen relative"
            style={{ backgroundColor: window.background || "#1a1941" }}
        >
            <div
                className="absolute flex items-center justify-center text-center font-bold bg-[#ffffff3f] border-solid border-8 rounded"
                style={{
                    left: `${window.text.x}px`,
                    top: `${window.text.y}px`,
                    width: `${window.text.width}px`,
                    height: `${window.text.height}px`,
                    fontSize: getBoxFontSize(window.text.height, window.text.width),
                    color: "white",
                }}
            >
                {question.question}
            </div>

            {window.buttons.map((button: any) => (
                <button
                    key={button.id}
                    className={`absolute font-bold rounded transition-all flex items-center justify-center text-center bg-[#ffffff3f] border-solid border-8 ${getHoverClass(button.text)}  ${(button.text === "Yes" || button.text === "Ja") ? "border-green-400" : ` ${(button.text === "No" || button.text === "Nee") ? "border-red-400" : "border-blue-400"}`}`}
                    style={{
                        left: `${button.x}px`,
                        top: `${button.y}px`,
                        width: `${button.width}px`,
                        height: `${button.height}px`,
                        fontSize: getBoxFontSize(button.height, button.width),
                        color: "white",
                    }}
                    onClick={() => castVote(button.text)}
                >
                    {button.text}
                </button>
            ))}
        </div>
    );
}

export default Question