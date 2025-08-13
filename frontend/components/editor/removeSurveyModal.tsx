import surveyService from "@/services/surveyService";
import { Survey } from "@/types";
import { useState } from "react";

type props = {
    onClose: () => void;
    reFetch(): void
    selectedSurvey?: Survey
}

const removeSurveyModal: React.FC<props> = ({ onClose, reFetch, selectedSurvey }) => {
    const [message, setMessage] = useState<{ message: string, type: string } | null>(null)

    const removeSurvey = async () => {
        setMessage({ message: "", type: "" })

        if (selectedSurvey) {
            try {
                const res = await surveyService.removeSurveyById(selectedSurvey.id)
                if (res.ok) {
                    const ans = await res.json()
                    console.log(ans)
                    reFetch()
                    onClose()

                } else {
                    const ans = await res.json()
                    setMessage({ message: ans.error, type: "Error" });
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error while removing survey:", error.message);
                    setMessage({ message: error.message, type: "Error" });
                } else {
                    console.error("Unknown error while removing survey:", error);
                    setMessage({ message: String(error), type: "Error" });
                }
            }
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] text-white"
            onClick={onClose}
        >
            <div
                className="bg-[#252525] p-6 rounded-lg shadow-lg flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-xl font-bold mb-4">Verwijder deze enquete</p>
                <p>Ben je zeker dat je "{selectedSurvey?.name}" wilt verwijderen?</p>
                <p>Deze actie is PERMANENT!</p>
                {message?.type === "success" ? (<p className="text-green-400 text-sm pb-3">{message ? message.message : ""}</p>) : (<p className="text-red-500 text-sm pb-3 ">{message ? message.message : ""}</p>)}
                <button
                    className="mt-4 px-4 py-2  text-white rounded bg-gray-400 hover:bg-gray-500"
                    onClick={removeSurvey}
                >
                    Verwijder enquete!
                </button>
                <div className="flex justify-between">
                    <button
                        className="mt-4 px-4 py-2  text-white rounded bg-red-400 hover:bg-red-500"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    );
}

export default removeSurveyModal