import express, { NextFunction, Request, Response } from 'express';
import answerService from '../services/answer.service';

const answerRouter = express.Router()

answerRouter.get('/:qid', async (req: Request, res: Response, next: NextFunction) =>{
    const qid = parseInt(req.params.qid)
    try{
        const response = await answerService.getAllAnswersByQuestionId(qid)
        res.status(200).json(response)
    }catch(error){
        res.status(500).json({message: "Error retriving all anwers for given question."})
    }
})


export {answerRouter}