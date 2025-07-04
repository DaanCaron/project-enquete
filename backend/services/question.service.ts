import { Question } from "../models/question"
import questionDb from "../repository/question.db";
import surveyDb from "../repository/survey.db";
import { QuestionData } from "../types";

const getAllQuestions = async (): Promise<Question[] | null> => {
    try{
        const questions = await questionDb.getAllQuestions()
        
        if(!questions){
            throw new Error('No question found with given ID');
        }
        return questions
    
    }catch(error){
        console.error(error);
        throw new Error('Error Question on given Survey');
    }
}

const getQuestionOnIdAndSurveyId = async (questionNumber: number, surveyId: number): Promise<Question | null> => {
    const survey = await surveyDb.getSurveyById(surveyId)
    
    if(!survey){
        throw new Error('No survey found with given ID');
    }

    try{
        const question = await questionDb.getQuestionBySequenceAndSurveyId(questionNumber, surveyId)
        
        if(!question){
            throw new Error('No question found with given ID');
        }
        return question

    }catch(error){
        console.error(error);
        throw new Error('Error Question on given Survey');
    }
}

const getAllQuestionsBySurveyId = async (surveyId: number): Promise<Question[] | null> =>{
    const survey = await surveyDb.getSurveyById(surveyId)
    
    if(!survey){
        throw new Error('No survey found with given ID');
    }

    try{
        const questions = await questionDb.getAllQuestionsBySurveyId(surveyId)
        
        if(!questions){
            throw new Error('No question found with given ID');
        }
        return questions

    }catch(error){
        console.error(error);
        throw new Error('Error Question on given Survey');
    }
}

const updateQuestions = async (question: QuestionData, qid: number) => {
    const questionCheck = await questionDb.getQuestionById(qid)

    if(!questionCheck){
        throw new Error('No question found with given ID');
    }

    try{
        const questionData: Question = new Question({
            id: question.id,
            question: question.question,
            sequence: question.sequence
        })

        const questionRes = await questionDb.updateQuestion(questionData, qid)

        if(!questionRes){
            throw new Error('Error updating given question');
        }
        
        return questionRes

    }catch(error){
        console.error(error);
        throw new Error('Error Question with given ID');
    }
}

export default {
    getQuestionOnIdAndSurveyId,
    getAllQuestions,
    getAllQuestionsBySurveyId,
    updateQuestions
}