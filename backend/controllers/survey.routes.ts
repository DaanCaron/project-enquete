import express, { NextFunction, Request, Response } from 'express';
import surveyService from '../services/survey.service';

const surveyRouter = express.Router()

surveyRouter.get('/all', async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const questions = await surveyService.getAllSurveys()
        res.status(200).json(questions)
    }catch (error){
        res.status(500).json({message: "Error retriving all questions."})
    }
})



export {surveyRouter}