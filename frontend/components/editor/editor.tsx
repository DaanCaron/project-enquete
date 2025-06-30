import { useEffect, useState } from "react"
import Window from "./window"
import { QuestionData } from "@/types"
import questionService from "@/services/QuestionService"

const Editor = () => {

    const [questions, setQuestions] = useState<QuestionData[] | null>(null)
    const [selectedQuestion, setSelectedQuestion] = useState<number>(1)
    const [disabledBack, setDisabledBack] = useState<boolean>(true)
    const [disabledNext, setDisabledNext] = useState<boolean>(false)

    useEffect(() => {
        fetchAllQuestions()
    }, [])

    const fetchAllQuestions = async () => {
        try {
            const res = await questionService.getAllQuestions()
            if (res.ok) {
                const questionData = await res.json()
                setQuestions(questionData)

                setDisabledBack(true)
                setDisabledNext(questionData.length <= 1)
            }
        } catch (error) {
            console.error("Failed to connect to server to get question.")
        }
    }

    useEffect(() => {
        if (!questions) return
        setDisabledBack(selectedQuestion === 1)
        setDisabledNext(selectedQuestion === questions.length)
    }, [selectedQuestion, questions])

    const onBack = () => {
        setSelectedQuestion((prev) => Math.max(prev - 1, 1))
    }

    const onNext = () => {
        if (questions) {
            setSelectedQuestion((prev) => Math.min(prev + 1, questions.length))
        }
    }

    const onUpdateWindow = (updatedWindow: QuestionData["window"]) => {
        console.log(updatedWindow)
    }

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">

            {questions && 
            <Window 
                question={questions[selectedQuestion - 1]} 
                previewWidth={1280} 
                previewHeight={720} 
                onUpdateWindow={onUpdateWindow}
            />}

            <div className="flex gap-5 mt-5">
                <button
                    onClick={onBack}
                    disabled={disabledBack}
                    aria-label="Back"
                    className={`text-3xl bg-transparent border-0  select-none ${disabledBack ? "cursor-not-allowed text-gray-400" : "cursor-pointer hover:text-gray-700"}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                {selectedQuestion}/{questions?.length}
                <button
                    onClick={onNext}
                    disabled={disabledNext}
                    aria-label="Next"
                    className={`text-3xl bg-transparent border-0  select-none ${disabledNext ? "cursor-not-allowed text-gray-400" : "cursor-pointer hover:text-gray-700"}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Editor