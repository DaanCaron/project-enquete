"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionRouter = void 0;
const express_1 = __importDefault(require("express"));
const question_service_1 = __importDefault(require("../services/question.service"));
const questionRouter = express_1.default.Router();
exports.questionRouter = questionRouter;
questionRouter.get('/all', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield question_service_1.default.getAllQuestions();
        res.status(200).json(questions);
    }
    catch (error) {
        res.status(500).json({ message: "Error retriving all questions." });
    }
}));
questionRouter.get('/:surveyId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const surveyId = parseInt(req.params.surveyId);
    try {
        const questions = yield question_service_1.default.getAllQuestionsBySurveyId(surveyId);
        res.status(200).json(questions);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete event', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error', error: String(error) });
        }
        // res.status(500).json({message: "Error retriving question with id " + questionId +", on survey " + surveyId + "."})
    }
}));
questionRouter.get('/:surveyId/:questionNumber', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const questionNumber = parseInt(req.params.questionNumber);
    const surveyId = parseInt(req.params.surveyId);
    try {
        const question = yield question_service_1.default.getQuestionOnIdAndSurveyId(questionNumber, surveyId);
        res.status(200).json(question);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete event', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error', error: String(error) });
        }
        // res.status(500).json({message: "Error retriving question with id " + questionId +", on survey " + surveyId + "."})
    }
}));
questionRouter.post('/vote/:qid/:vote/:weight', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const questionId = parseInt(req.params.qid);
    const vote = req.params.vote;
    const weight = parseInt(req.params.weight);
    try {
        const response = yield question_service_1.default.castVote(questionId, vote, weight);
        res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed add vote question', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error', error: String(error) });
        }
        // res.status(500).json({message: "Error retriving question with id " + questionId +", on survey " + surveyId + "."})
    }
}));
questionRouter.put("/update/:questionId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const questionId = parseInt(req.params.questionId);
    const questionBody = req.body;
    try {
        const window = yield question_service_1.default.updateQuestions(questionBody, questionId);
        res.status(200).json(window);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to update question', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error', error: String(error) });
        }
        // res.status(500).json({message: "Error retriving question with id " + questionId +", on survey " + surveyId + "."})
    }
}));
questionRouter.delete("/remove/:questionId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const questionId = parseInt(req.params.questionId);
    try {
        const question = yield question_service_1.default.removeQuestion(questionId);
        res.status(200).json(question);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to update question', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error', error: String(error) });
        }
        // res.status(500).json({message: "Error retriving question with id " + questionId +", on survey " + surveyId + "."})
    }
}));
