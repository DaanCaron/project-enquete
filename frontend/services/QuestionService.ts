import { QuestionData } from "@/types"

const getQuestionBySequenceAndSurveyId = async (sequence: number, survey:number) =>{
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/${survey}/${sequence}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
}

const getAllQuestions = async () =>{
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
}


const getAllQuestionsBysurveyId = async (survey:number) =>{
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/${survey}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
}

const changeQuestion = async (question: QuestionData) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/update/${question.id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question)
    })
}

const createQuestion = (question: QuestionData, surveyId: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/survey/${surveyId}/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
    });
};

export default{
    getQuestionBySequenceAndSurveyId,
    getAllQuestions,
    getAllQuestionsBysurveyId,
    changeQuestion,
    createQuestion
}