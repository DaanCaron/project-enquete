import express, { NextFunction, Request, Response } from 'express';
import questionService from '../services/question.service';

const questionRouter = express.Router()

questionRouter.get('/all', async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const questions = await questionService.getAllQuestions()
        res.status(200).json(questions)
    }catch (error){
        res.status(500).json({message: "Error retriving all questions."})
    }
})

questionRouter.get('/:surveyId', async (req: Request, res: Response, next: NextFunction) =>{
    const surveyId =  parseInt(req.params.surveyId)

    try{
        const questions = await questionService.getAllQuestionsBySurveyId(surveyId)
        res.status(200).json(questions)
    }catch (error){
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete event', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error', error: String(error) });
        }
        // res.status(500).json({message: "Error retriving question with id " + questionId +", on survey " + surveyId + "."})
    }
})

questionRouter.get('/:surveyId/:questionNumber', async (req: Request, res: Response, next: NextFunction) =>{
    const questionNumber =  parseInt(req.params.questionNumber)
    const surveyId =  parseInt(req.params.surveyId)
    
    try{
        const question = await questionService.getQuestionOnIdAndSurveyId(questionNumber, surveyId)
        res.status(200).json(question)
    }catch (error){
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete event', error: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error', error: String(error) });
        }
        // res.status(500).json({message: "Error retriving question with id " + questionId +", on survey " + surveyId + "."})
    } 
})


questionRouter.post('/add', async (req: Request, res: Response, next: NextFunction) =>{
    const body = req.body
    try{

    }catch(error){
        res.status(500).json({message: "Error adding event."})
    }
})

export {questionRouter}