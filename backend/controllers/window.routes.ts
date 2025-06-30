import express, { NextFunction, Request, Response } from 'express';
import { WindowConfig } from '../types';
import windowService from '../services/window.service';

const windowRouter = express.Router()

windowRouter.put("/update/:windowId", async (req: Request, res: Response, next: NextFunction) =>{
    const windowId = parseInt(req.params.windowId)
    const windowBody: WindowConfig = req.body
    try{
        const window = await windowService.updateWindow(windowBody, windowId)
        res.status(200).json(window)
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

export { windowRouter }