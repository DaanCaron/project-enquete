import { useEffect, useRef, useState } from "react"
import questionService from "../../services/QuestionService"
import { QuestionData } from "../../types"
import { io } from 'socket.io-client';


const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);


const Question: React.FC = () => {
    const [question, setQuestion] = useState<QuestionData | null>(null)
    const questionRef = useRef<QuestionData | null>(null);

    const sequence = useRef(1)
    const survey = useRef(0)
    const qid = useRef(0)

    const handleSelectGraph = (state: boolean) => {
        console.log(state)
        if (qid !== null && questionRef.current?.graphStyle) {
            console.log("Selected question ID:", qid.current, questionRef.current.graphStyle);
            socket.emit('selectGraph', qid.current, questionRef.current.graphStyle, state);
        }
    };

    useEffect(() => {
        questionRef.current = question;
    }, [question]);

    useEffect(() => {
        const selectSurvey = async (sid: number) => {
            if (sid === 0) {
                handleSelectGraph(false)
                survey.current = sid
                qid.current = 0
                setQuestion(null);
            } else {
                handleSelectGraph(false)
                survey.current = sid
                sequence.current = 1;
                const success = await fetchQuestionBySequenceAndSurvey(sequence.current, sid);
            }
        }
        const nextquestion = async () => {
            if (survey.current === 0) return;

            const nextSequence = sequence.current + 1;
            const success = await fetchQuestionBySequenceAndSurvey(nextSequence, survey.current);

            if (success) {
                handleSelectGraph(false)
                sequence.current = nextSequence;
            }
        };

        const prevQuestion = async () => {
            if (survey.current === 0 || sequence.current <= 1) return;

            const prevSequence = sequence.current - 1;
            const success = await fetchQuestionBySequenceAndSurvey(prevSequence, survey.current);

            if (success) {
                handleSelectGraph(false)
                sequence.current = prevSequence;
            }
        };

        const updateQuestion = () => {
            if (survey.current === 0) return;
            console.log("ws connected sucesful")
            fetchQuestionBySequenceAndSurvey(sequence.current, survey.current);
        }


        socket.on('nextQuestion', nextquestion);
        socket.on('toggleGraph', handleSelectGraph)
        socket.on('prevQuestion', prevQuestion);
        socket.on('updateQuestion', updateQuestion);
        socket.on('selectSurvey', selectSurvey)

        if (survey.current !== 0) {
            fetchQuestionBySequenceAndSurvey(sequence.current, survey.current);
        }

        return () => {
            socket.off('nextQuestion', nextquestion);
            socket.off('prevQuestion', prevQuestion);
            socket.off('updateQuestion', updateQuestion);
            socket.off('selectSurvey', selectSurvey)
        };
    }, []);


    const fetchQuestionBySequenceAndSurvey = async (sequence: number, survey: number): Promise<boolean> => {
        try {
            const res = await questionService.getQuestionBySequenceAndSurveyId(sequence, survey);
            if (res.ok) {
                const questionData = await res.json();
                qid.current = questionData.id;
                console.log(questionData)
                setQuestion(questionData);
                return true;
            }
        } catch (error) {
            console.error("Failed to connect to server to get question.");
        }
        return false;
    };
    if (survey.current === 0) {
        return (
            <div className="bg-[#424242] h-screen text-white flex justify-center items-center text-5xl">
            </div>
        );
    }
    else if (!question) {
        return (
            <div className="bg-[#424242] h-screen text-white flex justify-center items-center text-xl">
                <p>Wacht tot een vraag geselecteerd wordt! (Als dit sherm zichtbaar is, is er iets misgelopen in de code)</p>
            </div>
        );
    }

    const { window } = question;

    const getBoxFontSize = (height: number, width: number): string => {
        const scale = Math.min(width, height) * 0.3
        return `${Math.max(scale, 10)}px`
    }

    // const getHoverClass = (text: string) => {
    //     if (text === "Yes" || text === "Ja") return "active:bg-green-200";
    //     if (text === "No" || text === "Nee") return "active:bg-red-200";
    //     return "active:bg-blue-200";
    // };

    const castVote = async (vote: string, weight: number) => {
        try {
            const res = await questionService.castVote(question.id, vote, weight)
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
                    // className={`absolute font-bold rounded transition-all flex items-center justify-center text-center bg-[#ffffff3f] border-solid border-8 ${getHoverClass(button.text)}  ${(button.text === "Yes" || button.text === "Ja") ? "border-green-400" : ` ${(button.text === "No" || button.text === "Nee") ? "border-red-400" : "border-blue-400"}`}`}
                    className={`absolute font-bold rounded transition-all flex items-center justify-center text-center bg-[#ffffff3f] border-solid border-8 border-blue-400`}
                    style={{
                        left: `${button.x}px`,
                        top: `${button.y}px`,
                        width: `${button.width}px`,
                        height: `${button.height}px`,
                        fontSize: getBoxFontSize(button.height, button.width),
                        color: "white",
                    }}
                    onClick={() => castVote(button.text, button.weight)}
                >
                    {button.text}
                </button>
            ))}
        </div>
    );
}

export default Question