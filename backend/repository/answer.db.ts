import { Answer } from "../models/answer";
import database from "../util/database";

const getAllAnswersByQuestionId = async (qid: number) => {
    try{
        const answerPrisma = await database.answer.findMany({
            where:{
                questionId: qid
            },
        })
        if(answerPrisma === null){
            return null
        }

        return answerPrisma.map((answer) => Answer.from(answer))
    }catch(error){
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
}

const removeAllAnswersForQuestion = async (qid: number) => {
    try{
        const answerPrisma = await database.answer.deleteMany({
            where:{
                questionId: qid
            }
        })

        return answerPrisma.count; 
        
    }catch(error){
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
}

export default {
    getAllAnswersByQuestionId,
    removeAllAnswersForQuestion
}