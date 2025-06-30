import { useEffect, useState } from "react"
import questionService from "../../services/QuestionService"
import { QuestionData } from "../../types"

const Question: React.FC = () => {
    const [question, setQuestion] = useState<QuestionData | null>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            fetchQuestionBySequenceAndSurvey(2, 6);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const fetchQuestionBySequenceAndSurvey = async (sequence: number, survey: number) => {
        try {
            const res = await questionService.getQuestionBySequenceAndSurveyId(sequence, survey)
            if (res.ok) {
                const questionData = await res.json()
                console.log(questionData)
                setQuestion(questionData)
            }

        } catch (error) {
            console.error("Failed to connect to server to get qusetion.");
        }
    }

    if (!question) {
        return (
            <div className="bg-[#1a1941] h-screen text-white flex justify-center items-center text-2xl">
                <p>Loading...</p>
            </div>
        );
    }

    const { window } = question;

    const getBoxFontSize = (height: number, width: number): string => {
        const scale = Math.min(width, height) * 0.3
        return `${Math.max(scale, 10)}px`
    }

    return (
        <div
            className="h-screen w-screen relative"
            style={{ backgroundColor: window.background || "#1a1941" }}
        >
            <div
                className="absolute flex items-center justify-center text-center font-bold"
                style={{
                    left: `${window.text.x}px`,
                    top: `${window.text.y}px`,
                    width: `${window.text.width}px`,
                    height: `${window.text.height}px`,
                    fontSize: getBoxFontSize(window.text.height, window.text.width),
                    color: "white", // matches draggable box "text-black"
                    backgroundColor: "transparent",
                }}
            >
                {question.question}
            </div>

            {window.buttons.map((button: any) => (
                <button
                    key={button.id}
                    className="absolute font-bold rounded hover:bg-gray-200 transition-all flex items-center justify-center text-center"
                    style={{
                        left: `${button.x}px`,
                        top: `${button.y}px`,
                        width: `${button.width}px`,
                        height: `${button.height}px`,
                        fontSize: getBoxFontSize(button.height, button.width),
                        backgroundColor: "#3B82F6",
                        color: "white",
                    }}
                >
                    {button.text}
                </button>
            ))}
        </div>
    );
}

export default Question