import { useEffect, useRef, useState } from "react"
import Window from "./window"
import { QuestionData, Survey, WindowConfig } from "@/types"
import questionService from "@/services/QuestionService"
import surveyService from "@/services/surveyService"
import LeftSideMenu from "./leftSideMenu"
import windowService from "@/services/windowService"

const Editor = () => {

    const [questions, setQuestions] = useState<QuestionData[] | null>(null)
    const [selectedQuestion, setSelectedQuestion] = useState<number>(1)
    const [disabledBack, setDisabledBack] = useState<boolean>(true)
    const [disabledNext, setDisabledNext] = useState<boolean>(false)
    const [surveys, setSurveys] = useState<Survey[] | null>(null)
    const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null)

    const [toggle, setToggle] = useState(false);
    const [message, setMessage] = useState<{ message: string, type: string } | null>(null)

    const windowData = useRef<WindowConfig | null>(null)

    useEffect(() => {
        setMessage({ message: "", type: "" })
        windowData.current = null
        const doRefetch = async () => {
            const surveysData = await fetchAllSurveys()
            if (!surveysData) return

            if (selectedSurveyId !== null) {
                await fetchAllQuestionsBySurveyId(selectedSurveyId, true)
            } else {
                const fallbackSurveyId = surveysData[0]?.id
                if (fallbackSurveyId) {
                    await fetchAllQuestionsBySurveyId(fallbackSurveyId)
                }
            }
        }
        doRefetch()
    }, [toggle])

    useEffect(() => {
        setMessage({ message: "", type: "" })
        if (!questions) return
        setDisabledBack(selectedQuestion === 1)
        setDisabledNext(selectedQuestion === questions.length)
    }, [selectedQuestion, questions])

    const fetchAllQuestionsBySurveyId = async (
        surveyId: number,
        preserveQuestionIndex: boolean = false
    ) => {
        try {
            const res = await questionService.getAllQuestionsBysurveyId(surveyId)
            if (res.ok) {
                const questionData = await res.json()
                setQuestions(questionData)
                setSelectedSurveyId(surveyId)

                setSelectedQuestion(prev =>
                    preserveQuestionIndex ? Math.min(prev, questionData.length) : 1
                )

                setDisabledBack(true)
                setDisabledNext(questionData.length <= 1)
            }
        } catch (error) {
            console.error("Failed to connect to server to get questions.", error)
        }
    }

    const fetchAllSurveys = async (): Promise<Survey[] | null> => {
        try {
            const res = await surveyService.getAllSurveys()
            if (res.ok) {
                const surveyData = await res.json()
                setSurveys(surveyData)
                return surveyData
            }
        } catch (error) {
            console.error("Failed to connect to server to get surveys.", error)
        }
        return null
    }

    const onBack = () => {
        setSelectedQuestion((prev) => Math.max(prev - 1, 1))
    }

    const onNext = () => {
        if (questions) {
            setSelectedQuestion((prev) => Math.min(prev + 1, questions.length))
        }
    }

    const onUpdateWindow = (updatedWindow: QuestionData["window"]) => {
        windowData.current = {
            id: updatedWindow.id,
            background: updatedWindow.background,
            buttons: updatedWindow.buttons,
            text: updatedWindow.text
        }
    }

    const onSubmit = async () => {
        if (!windowData.current) {
            setMessage({
                message: "No changes made, did not save!",
                type: "Error"
            })
            return
        }
        try {
            const res = await windowService.updateWindow(windowData.current)
            if (res.ok) {
                
                const windowData = await res.json()
                console.log(windowData)
                setMessage({
                    message: "Saved!",
                    type: "success"
                })
            }
        } catch (error) {
            setMessage({
                message: "Generic error check logs!",
                type: "Error"
            })
            console.error("Failed to update window.", error)
        }

    }

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <div className="flex flex-row items-start ">
                {questions &&
                    <Window
                        question={questions[selectedQuestion - 1]}
                        previewWidth={1280}
                        previewHeight={720}
                        onUpdateWindow={onUpdateWindow}
                    />}
                <LeftSideMenu
                    submit={() => onSubmit()}
                    reFetch={() => setToggle(prev => !prev)}
                    surveys={surveys}
                    fetchAllQuestionsBySurveyId={fetchAllQuestionsBySurveyId}
                    message={message}
                />
            </div>

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