import { Survey } from "../models/survey";
import surveyDb from "../repository/survey.db";

const getAllSurveys = async (): Promise<Survey[] | null> => {
    try{
        const surveys = await surveyDb.getAllSurveys()
        
        if(!surveys){
            throw new Error('No question found with given ID');
        }
        return surveys
    
    }catch(error){
        console.error(error);
        throw new Error('Error Question on given Survey');
    }
}



export default {
    getAllSurveys,
}