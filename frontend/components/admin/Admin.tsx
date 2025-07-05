import surveyService from "@/services/surveyService";
import { Survey } from "@/types";
import { useState, useEffect } from "react";
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);
const Admin: React.FC = () => {
    const [surveys, setSurveys] = useState<Survey[] | null>(null)
    const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);

    useEffect(() => {
        fetchAllSurveys()
        return () => {
            socket.off('nextQuestion');
            socket.off('prevQuestion');
        };
    }, []);


    const handleClickNext = () => {
        socket.emit('nextQuestion');
    };

    const handleClickPrev = () => {
        socket.emit('prevQuestion');
    };

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
        <div className="h-screen w-full flex flex-col items-center justify-center gap-6">
            <div className="w-full max-w-md">
                <label htmlFor="survey-select" className="block mb-2 font-medium text-gray-700">
                    Kies een survey
                </label>
                <select
                    id="survey-select"
                    value={selectedSurvey || ""}
                    onChange={(e) => setSelectedSurvey(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    {surveys?.map((survey) => (
                        <option key={survey.id} value={survey.id}>
                            {survey.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="text-3xl flex gap-5">
                <button
                    onClick={handleClickPrev}
                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
                >
                    Vorige vraag
                </button>
                <button
                    onClick={handleClickNext}
                    className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-95"
                >
                    Volgende vraag
                </button>
            </div>
        </div>
    );
}

export default Admin