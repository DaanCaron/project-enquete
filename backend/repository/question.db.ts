import { Question } from "../models/question"
import database from "../util/database"

const getQuestionBySequenceAndSurveyId = async (sequence: number, surveyId: number) =>{
    try{
        const questionPrisma = await database.question.findFirst({
            where: {
                sequence: sequence,
                surveyId: surveyId
            },
            include: {answers: true, survey: true, window: {include: {buttons: true, text: true}}}
        })
        if (questionPrisma === null){
            return null
        } 
        return Question.from(questionPrisma)
    }catch(error){
        console.error(error);
        throw new Error('Database error for events. See server log for details.')
    }
}

export default {
    getQuestionBySequenceAndSurveyId
}