import { Survey } from "@/types"

type props = {
    surveys: Survey[] | null
    fetchAllQuestionsBySurveyId(id: number): void
    reFetch(): void
    submit(): void
    message: { message: string, type: string } | null
    addQuestion(): void
    removeQuestion(): void

}

const RightSideMenu: React.FC<props> = ({ surveys, fetchAllQuestionsBySurveyId, reFetch, submit, message, addQuestion, removeQuestion }) => {
    return (
        <div className="bg-[#252525]  ml-4 h-full w-64 p-4 rounded shadow-lg flex flex-col justify-between text-white">
            <div>
                <div className="mt-6 max-h-52 overflow-y-auto px-4 py-2 bg-gray-100 rounded-lg shadow flex flex-col gap-2">
                    {surveys?.map((survey) => (
                        <button
                            key={survey.id}
                            onClick={() => fetchAllQuestionsBySurveyId(survey.id)}
                            className="text-left px-4 py-2 rounded-md bg-white text-black hover:bg-blue-100 transition-colors duration-150"
                        >
                            {survey.name}
                        </button>
                    ))}
                </div>
                <div className="w-full flex justify-between h-28 ">
                    
                    <button
                        onClick={() => removeQuestion()}
                        className="rounded-md bg-red-400 hover:bg-red-500 transition-colors duration-150 w-24 text-white mt-10"
                    >
                        remove current question!
                    </button>
                    <button
                        onClick={() => addQuestion()}
                        className="rounded-md bg-green-400 hover:bg-green-500 transition-colors w-24 duration-150 text-white mt-10"
                    >
                        Add a question!
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