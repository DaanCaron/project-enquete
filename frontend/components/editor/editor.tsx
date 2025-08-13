import { useEffect, useRef, useState } from "react"
import Window from "./window"
import { Button, QuestionData, Survey, WindowConfig } from "@/types"
import questionService from "@/services/QuestionService"
import surveyService from "@/services/surveyService"
import LeftSideMenu from "./leftSideMenu"
import windowService from "@/services/windowService"
import RightSideMenu from "./rightSideMenu"
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);

const Editor = () => {

    const [questions, setQuestions] = useState<QuestionData[] | null>(null)
    const [selectedQuestion, setSelectedQuestion] = useState<number>(1)
    const [disabledBack, setDisabledBack] = useState<boolean>(true)
    const [disabledNext, setDisabledNext] = useState<boolean>(false)
    const [surveys, setSurveys] = useState<Survey[] | null>(null)
    const selectedSurveyIdRef = useRef<number | null>(null)

    const [toggle, setToggle] = useState(false);
    const [message, setMessage] = useState<{ message: string, type: string } | null>(null)

    const windowData = useRef<WindowConfig | null>(null)
    const [snapToGrid, setSnapToGrid] = useState<boolean>(false)

    useEffect(() => {
        setMessage({ message: "", type: "" })
        windowData.current = null
        const doRefetch = async () => {
            const surveysData = await fetchAllSurveys()
            if (!surveysData) return

            if (selectedSurveyIdRef.current !== null) {
                await fetchAllQuestionsBySurveyId(selectedSurveyIdRef.current, true)
            } else {
                const fallbackSurveyId = surveysData[0]?.id
                if (fallbackSurveyId) {
                    await fetchAllQuestionsBySurveyId(fallbackSurveyId)
                }
            }
        }
        doRefetch()
        return () => {
            socket.off('updateQuestion');
        };
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
                let questionData = await res.json()
                questionData = questionData.sort((a: any, b: any) => { return a.sequence - b.sequence })
                setQuestions(questionData)
                selectedSurveyIdRef.current = surveyId

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

        if (questions) {
            const updatedQuestions = [...questions]
            updatedQuestions[selectedQuestion - 1] = {
                ...updatedQuestions[selectedQuestion - 1],
                window: { ...updatedWindow }
            }
            setQuestions(updatedQuestions)
        }
    }

    const onSubmit = async () => {
        if (!questions) {
            setMessage({
                message: "No questions available to save!",
                type: "Error"
            })
            return
        }
        try {
            const res = await questionService.changeQuestion(questions[selectedQuestion - 1])
            if (res.ok) {
                const updatedQuestion = await res.json()
                console.log(updatedQuestion)
            }
        } catch (error) {
            setMessage({
                message: "Generic error check logs!",
                type: "Error"
            })
            console.error("Failed to update window.", error)
        }

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
                socket.emit('updateQuestion');
                const savedWindow = await res.json()
                console.log(savedWindow)
                setMessage({
                    message: "Saved!",
                    type: "success"
                })
                windowData.current = null
            }
        } catch (error) {
            setMessage({
                message: "Generic error check logs!",
                type: "Error"
            })
            console.error("Failed to update window.", error)
        }

    }

    const changeColor = (color: string) => {
        if (questions) {
            const updated = [...questions]
            updated[selectedQuestion - 1].window.background = color
            setQuestions(updated)

            const updatedWindow = updated[selectedQuestion - 1].window
            onUpdateWindow(updatedWindow)
        }
    }

    const changeGraph = (graphStyle: string) => {
        if(questions){
            const updated = [...questions]
            updated[selectedQuestion - 1].graphStyle = graphStyle
            setQuestions(updated)

            onSubmit()
        }
    }

    const onUpdateQuestionText = (newText: string) => {
        if (!questions) return;

        const updated = [...questions];
        updated[selectedQuestion - 1] = {
            ...updated[selectedQuestion - 1],
            question: newText,
        };

        setQuestions(updated);
    };

    const addButton = () => {
        if (!questions) { return }

        const selectedWindow = questions[selectedQuestion - 1].window
        const buttons = selectedWindow.buttons;
        const lastId = buttons.length > 0 ? Math.max(...buttons.map(b => b.id)) : 0;

        const newButton: Button = {
            id: lastId + 1,
            x: 0,
            y: 0,
            width: 360,
            height: 180,
            text: "New Button",
            weight: 0
        };

        const updatedButtons = [...buttons, newButton];

        for(let i = 0; i < updatedButtons.length; i++){
            updatedButtons[i].weight = Math.round((100 / (updatedButtons.length - 1)) * i)
        }

        console.log(updatedButtons)

        const updatedWindow: WindowConfig = {
            ...selectedWindow,
            buttons: updatedButtons,
        };

        windowData.current = updatedWindow;

        const updatedQuestions = [...questions];
        updatedQuestions[selectedQuestion - 1] = {
            ...updatedQuestions[selectedQuestion - 1],
            window: updatedWindow,
        };

        setQuestions(updatedQuestions);
    }

    const addQuestion = async () => {
        if (!questions) { return }
        console.log(selectedSurveyIdRef.current)

        const lastSequence = questions.length > 0
            ? Math.max(...questions.map(q => q.sequence))
            : 0;

        const newQuestion: QuestionData = {
            id: -1,
            question: "New Question",
            graphStyle: "hist",
            sequence: lastSequence + 1,
            answers: [],
            survey: surveys?.find(s => s.id === selectedSurveyIdRef.current)!,
            window: {
                id: -1,
                background: "#a5a5a5",
                buttons: [],
                text: {
                    id: -1,
                    x: 90,
                    y: 45,
                    width: 855,
                    height: 180,
                    windowId: -1,
                },
            },
        };

        if (selectedSurveyIdRef.current === null) {
            setMessage({ message: "No survey selected.", type: "Error" });
            return;
        }
        try {
            const res = await questionService.createQuestion(newQuestion, selectedSurveyIdRef.current);
            if (res.ok) {
                const createdQuestion = await res.json();
                const updatedQuestions = [...questions, createdQuestion].sort(
                    (a, b) => a.sequence - b.sequence
                );

                setQuestions(updatedQuestions);
                setSelectedQuestion(updatedQuestions.length);
            } else {
                setMessage({ message: "Failed to create question.", type: "Error" });
            }
        } catch (error) {
            console.error("Error while creating question:", error);
            setMessage({ message: "Generic error check logs!", type: "Error" });
        }
    }

    const removeQuestion = async () => {
        if (!questions || selectedSurveyIdRef.current === null) return;

        const questionId = questions[selectedQuestion - 1].id;

        try {
            const res = await questionService.removeQuestion(questionId);
            if (res.ok) {
                await fetchAllQuestionsBySurveyId(selectedSurveyIdRef.current, true);

                // Optionally adjust selectedQuestion here if needed
                setSelectedQuestion(prev => Math.min(prev, questions.length - 1 > 0 ? questions.length - 1 : 1));

                setMessage({ message: "Question removed!", type: "success" });
            } else {
                setMessage({ message: "Failed to remove question.", type: "Error" });
            }
        } catch (error) {
            console.error("Error while removing question:", error);
            setMessage({ message: "Generic error, check logs!", type: "Error" });
        }
    }

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <div className="flex flex-row items-start ">

                {(questions && questions.length > 0) &&
                    <>
                        <LeftSideMenu
                            originalColor={questions[selectedQuestion - 1].window.background}
                            changeColor={changeColor}
                            snapToGrid={(state) => setSnapToGrid(state)}
                            addButton={addButton}
                            selectedGraph={questions[selectedQuestion - 1].graphStyle}
                            changeGraph={changeGraph}
                        />
                        <Window
                            question={questions[selectedQuestion - 1]}
                            previewWidth={800}
                            previewHeight={600}
                            onUpdateWindow={onUpdateWindow}
                            snapToGrid={snapToGrid}
                            onUpdateQuestionText={onUpdateQuestionText}
                        />
                    </>}

                <RightSideMenu
                    submit={() => onSubmit()}
                    reFetch={() => setToggle(prev => !prev)}
                    surveys={surveys}
                    fetchAllQuestionsBySurveyId={fetchAllQuestionsBySurveyId}
                    message={message}
                    addQuestion={addQuestion}
                    removeQuestion={removeQuestion}
                    selectedSurvey={surveys?.find((survey) => survey.id === selectedSurveyIdRef.current)}
                />
            </div>

            <div className="flex gap-5 mt-5 text-black">
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