import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { eventRouter } from './controllers/event.routes'

const app = express();


dotenv.config();
const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 8000;

app.use(cors());
app.use(bodyParser.json());


app.use('/event', eventRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Car calendar API is running...' });
});

app.listen(port || 8000, '0.0.0.0', () => {
    console.log(`Car calendar API is running on port ${port || 8000}.`);
});


export default app;