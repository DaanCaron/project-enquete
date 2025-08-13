import answerService from "@/services/answerService";
import QuestionService from "@/services/QuestionService";
import surveyService from "@/services/surveyService";
import { QuestionData, Survey } from "@/types";
import { useState, useEffect, useRef } from "react";
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);
const Admin: React.FC = () => {
    const [surveys, setSurveys] = useState<Survey[] | null>(null)
    const [selectedSurvey, setSelectedSurvey] = useState<number | null>(null);
    let state = false

    useEffect(() => {
        fetchAllSurveys()
        return () => {
            socket.off('nextQuestion');
            socket.off('prevQuestion');
            socket.off('selectSurvey');
        };
    }, []);


    const handleClickNext = () => {
        state = false
        socket.emit('nextQuestion');
    };

    const handleClickPrev = () => {
        state = false
        socket.emit('prevQuestion');
    };

    const removeAllAnswersFromSurvey = async () => {
        if (selectedSurvey !== null) {
            const res = await QuestionService.getAllQuestionsBysurveyId(selectedSurvey)
            const questions: QuestionData[] = await res.json()

            for (let index = 0; index < questions.length; index++) {
                const res = await answerService.removeAllAnswersForQuestion(questions[index].id)
                const ans = await res.json()
                console.log(ans)
            }
        }
    }


    const handleSelectSurvey = () => {
        state = false
        if (selectedSurvey !== null) {
            removeAllAnswersFromSurvey()
            console.log("Selected survey ID:", selectedSurvey);
            socket.emit('selectSurvey', selectedSurvey);
        }
    };

    const handleToggleGraph = () => {
        state = !state
        console.log(state)
        socket.emit('toggleGraph', state)
    }

    const handleStopSurvey = () => {
        state = false
        socket.emit('selectSurvey', 0);
    }

    const fetchAllSurveys = async () => {
        try {
            const res = await surveyService.getAllSurveys();
            if (res.ok) {
                const data = await res.json();
                setSurveys(data);
                if (data.length > 0) setSelectedSurvey(data[0].id);
            }
        } catch (error) {
            console.error("Failed to load surveys:", error);
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-end justify-center gap-6 pr-24">
            <div className="max-w-lg">
                <div className="flex w-full gap-5 mb-5">
                    <select
                        id="survey-select"
                        value={selectedSurvey || ""}
                        onChange={(e) => setSelectedSurvey(parseInt(e.target.value))}
                        className="w-full px-4 py-4 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        {surveys
                            ?.filter((survey: Survey) => survey.questions.length > 0).map((survey: Survey) => (
                                <option key={survey.id} value={survey.id}>
                                    {survey.name}
                                </option>
                            ))}
                    </select>

                    <button
                        onClick={handleSelectSurvey}
                        className="px-6 py-4 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
                    >
                        Start enquete
                    </button>
                    <button
                        onClick={handleStopSurvey}
                        className="px-6 py-4 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
                    >
                        Stop enquete
                    </button>
                </div>
                <div className="text-3xl flex gap-5 mb-5">
                    <button
                        onClick={handleClickPrev}
                        className="px-6 py-6 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
                    >
                        Vorige vraag
                    </button>
                    <button
                        onClick={handleClickNext}
                        className="px-6 py-6 rounded-xl bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
                    >
                        Volgende vraag
                    </button>
                </div>
                <div className="text-3xl flex gap-5">
                    <button
                        onClick={handleToggleGraph}
                        className="px-6 py-6 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
                    >
                        Toggle grafiek voor actieve vraag
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Admin