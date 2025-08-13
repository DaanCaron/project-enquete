import { Survey } from "@/types"
import { useEffect, useState } from "react"
import AddSurveyModal from "./addSurveyModal"
import RemoveSurveyModal from "./removeSurveyModal"

type props = {
    surveys: Survey[] | null
    fetchAllQuestionsBySurveyId(id: number): void
    reFetch(): void
    submit(): void
    message: { message: string, type: string } | null
    addQuestion(): void
    removeQuestion(): void
    selectedSurvey?: Survey
}

const RightSideMenu: React.FC<props> = ({ surveys, fetchAllQuestionsBySurveyId, reFetch, submit, message, addQuestion, removeQuestion, selectedSurvey }) => {
    const [showModal, setShowModal] = useState(false)
    const [showModalRemove, setShowModalRemove] = useState(false)


    const switchModalState = () => {
        setShowModal(prev => !prev)
    }

    const switchModalStateRemove = () => {
        setShowModalRemove(prev => !prev)
    }

    useEffect(() => {

    }, [selectedSurvey])

    return (
        <div className="bg-[#252525]  ml-4 h-full w-64 p-4 rounded shadow-lg flex flex-col justify-between text-white">
            <div>
                <div className="w-full max-w-md">
                    <label htmlFor="survey-select" className="block mb-2 font-medium">
                        Kies een enquete
                    </label>
                    <select
                        id="survey-select"
                        value={selectedSurvey?.id ?? ""}
                        onChange={(e) => fetchAllQuestionsBySurveyId(parseInt(e.target.value))}
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        {surveys?.map((survey) => (
                            <option key={survey.id} value={survey.id}>
                                {survey.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full flex justify-between h-24">
                    <button
                        onClick={() => switchModalStateRemove()}
                        className="w-full rounded-md bg-red-500 hover:bg-red-600 transition-colors duration-150 text-white mt-10"
                    >
                        Verwijder deze enquete
                    </button>
                    <button
                        onClick={() => switchModalState()}
                        className="w-full rounded-md ml-5 bg-gray-400 hover:bg-gray-500 transition-colors  duration-150 text-white mt-10"
                    >
                        Voeg een enquete toe
                    </button>

                    
                    {showModal &&
                        <div>
                            <AddSurveyModal onClose={switchModalState} reFetch={reFetch}/>
                        </div>

                    }

                    {showModalRemove &&
                        <div>
                            <RemoveSurveyModal onClose={switchModalStateRemove} reFetch={reFetch} selectedSurvey={selectedSurvey}/>
                        </div>

                    }


                </div>
                <div className="w-full flex justify-between h-28 ">

                    <button
                        onClick={() => removeQuestion()}
                        className="rounded-md bg-red-400 hover:bg-red-500 transition-colors duration-150 w-24 text-white mt-10"
                    >
                        Verwijder huidige vraag!
                    </button>
                    <button
                        onClick={() => addQuestion()}
                        className="rounded-md bg-green-400 hover:bg-green-500 transition-colors w-24 duration-150 text-white mt-10"
                    >
                        Voeg een vraag toe!
                    </button>
                </div>
            </div>
            <div>
                {message?.type === "success" ? (<p className="text-green-400 text-sm pb-3 text-right">{message ? message.message : ""}</p>) : (<p className="text-red-500 text-sm pb-3 text-center">{message ? message.message : ""}</p>)}
                <div className="w-full flex justify-between h-10">
                    <button
                        onClick={reFetch}
                        className="rounded-md bg-red-400 hover:bg-red-500 transition-colors duration-150 w-24"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        className="rounded-md bg-green-400 hover:bg-green-500 transition-colors duration-150 w-24"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RightSideMenu