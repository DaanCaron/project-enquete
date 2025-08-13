import surveyService from "@/services/surveyService";
import { Survey } from "@/types";
import { useState } from "react";

type props = {
    onClose: () => void;
    reFetch(): void
}


const addSurveyModal: React.FC<props> = ({ onClose, reFetch }) => {
    const [surveyName, setSurveyName] = useState('');
    const [message, setMessage] = useState<{ message: string, type: string } | null>(null)

    const addSurvey = async () => {
        setMessage({ message: "", type: "" })

        if(surveyName.length <= 0 ){
            setMessage({message: "Voeg een naame toe",type: "error"})
            return
        }

        
        const dummySurvey: Survey = {
            id: -1,
            name: surveyName,
            questions: []
        }


        try{
            const res = await surveyService.addSurvey(surveyName, dummySurvey)
            if (res.ok) {
                const ans = await res.json()
                console.log(ans)
                reFetch()
                onClose()

            } else {
                const ans = await res.json()
                setMessage({ message: ans.error, type: "Error" });
            }
        }catch (error) {
            if (error instanceof Error) {
                console.error("Error while adding survey:", error.message);
                setMessage({ message: error.message, type: "Error" });
            } else {
                console.error("Unknown error while adding survey:", error);
                setMessage({ message: String(error), type: "Error" });
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
                <p className="text-xl font-bold mb-4">Voeg een enquete toe</p>
                <label>
                    Naam enquete:
                    <input
                        className="ml-5 text-black"
                        name="surveyInput"
                        value={surveyName}
                        onChange={(e) => setSurveyName(e.target.value)}
                    />
                </label>
                {message?.type === "success" ? (<p className="text-green-400 text-sm pb-3">{message ? message.message : ""}</p>) : (<p className="text-red-500 text-sm pb-3 ">{message ? message.message : ""}</p>)}
                <div className="flex justify-between">
                    <button
                        className="mt-4 px-4 py-2  text-white rounded bg-red-400 hover:bg-red-500"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="mt-4 px-4 py-2  text-white rounded bg-green-400 hover:bg-green-500"
                        onClick={addSurvey}
                    >
                        Voeg toe
                    </button>
                </div>
            </div>
        </div>
    );
}

export default addSurveyModal