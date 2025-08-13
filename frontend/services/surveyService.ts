import { Survey } from "@/types"

const getAllSurveys = async () =>{
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/survey/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
}

const addSurvey = async (name: string, survey: Survey) =>{
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/survey/add/${name}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(survey),
        })
}

const removeSurveyById = async (id: number) =>{
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/survey/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
}

export default{
    getAllSurveys,
    addSurvey,
    removeSurveyById
}