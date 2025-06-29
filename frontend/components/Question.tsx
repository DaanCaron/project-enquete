import { useEffect, useState } from "react"
import questionService from "../services/QuestionService"
import { QuestionData } from "../types"

const Question: React.FC = () => {
    const [question, setQuestion] = useState<QuestionData | null>(null)

    useEffect(() => {
        fetchQuestionBySequenceAndSurvey(1,4)
    }, [])

    const fetchQuestionBySequenceAndSurvey = async (sequence: number, survey: number) => {
        try {
            const res = await questionService.getQuestionBySequenceAndSurveyId(sequence, survey)
            if(res.ok){
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

    return (
        <div
            className="h-screen w-screen relative"
            style={{ backgroundColor: window.background || "#1a1941" }}
        >
            <div 
                className="absolute text-white text-xl flex items-center justify-center"
                style={{
                    left: `${window.text.x}px`,
                    top: `${window.text.y}px`,
                    width: `${window.text.width}px`,
                    height: `${window.text.height}px`,
                }}    
            >
                {question.question}
            </div>

            {window.buttons.map((button: any) => (
                <button
                key={button.id}
                className="absolute bg-white text-black font-bold rounded hover:bg-gray-200 transition-all"
                style={{
                    left: `${button.x}px`,
                    top: `${button.y}px`,
                    width: `${button.width}px`,
                    height: `${button.height}px`,
                }}
                >
                    {button.text}
                </button>
            ))}
        </div>
    );
}

export default Question