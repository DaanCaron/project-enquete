import { Survey } from "../models/survey";
import database from "../util/database";

const getSurveyById = async (id: number): Promise<Survey | null> =>{
    try{
        const surveyPrisma = await database.survey.findUnique({
            where: {
                id: id
            },
            include: {questions: true}
        })
        if (surveyPrisma === null) {
            return null;
        }
        return Survey.from(surveyPrisma)
    }catch(error){
        console.error(error);
        throw new Error('Database error for events. See server log for details.')
    }
}

export default{
    getSurveyById
}