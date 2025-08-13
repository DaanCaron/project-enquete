import express, { NextFunction, Request, Response } from 'express';
import surveyService from '../services/survey.service';
import { QuestionData, SurveyData } from '../types';
import questionService from '../services/question.service';

const surveyRouter = express.Router()

surveyRouter.get('/all', async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const questions = await surveyService.getAllSurveys()
        res.status(200).json(questions)
    }catch (error){
        res.status(500).json({message: "Error retriving all questions."})
    }
})

surveyRouter.post("/:surveyId/question", async (req: Request, res: Response, next: NextFunction) =>{
    const surveyId = parseInt(req.params.surveyId)
    const questionBody: QuestionData = req.body
    try{
        const question = await questionService.createQuestionOnSurvey(questionBody, surveyId)
        res.status(200).json(question)
    }catch (error){
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to update question', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error', error: String(error) });
        }
        // res.status(500).json({message: "Error retriving question with id " + questionId +", on survey " + surveyId + "."})
    }
})

surveyRouter.post("/add/:name", async (req: Request, res: Response, next: NextFunction) =>{
    const name = req.params.name
    const dummySurvey: SurveyData = req.body
    try{
        const survey = await surveyService.createSurvey(dummySurvey, name)
        res.status(200).json(survey)
    }catch (error){
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to update question', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error', error: String(error) });
        }
        // res.status(500).json({message: "Error retriving question with id " + questionId +", on survey " + surveyId + "."})
    }
})

surveyRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) =>{
    const surveyId = parseInt(req.params.id)
    try{
        const survey = await surveyService.removeSurveyById(surveyId)
        res.status(200).json(survey)
    }catch (error){
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to update question', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error', error: String(error) });
        }
        // res.status(500).json({message: "Error retriving question with id " + questionId +", on survey " + surveyId + "."})
    }
})



export {surveyRouter}