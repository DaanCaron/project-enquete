import express, { NextFunction, Request, Response } from 'express';

const questionRouter = express.Router()

questionRouter.get('/', async (req: Request, res: Response, next: NextFunction) =>{
    try{

    }catch (error){
        res.status(500).json({message: "Error retriving all questions."})
    }
})

questionRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) =>{
    const id = req.params.id
    try{

    }catch (error){
        res.status(500).json({message: "Error retriving question with id " + id +"."})
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