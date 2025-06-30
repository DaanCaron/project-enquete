import express, { NextFunction, Request, Response } from 'express';

const windowRouter = express.Router()

windowRouter.put("/update", async (req: Request, res: Response, next: NextFunction) =>{

})

export { windowRouter }