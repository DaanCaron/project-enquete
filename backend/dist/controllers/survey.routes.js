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
exports.surveyRouter = void 0;
const express_1 = __importDefault(require("express"));
const survey_service_1 = __importDefault(require("../services/survey.service"));
const question_service_1 = __importDefault(require("../services/question.service"));
const surveyRouter = express_1.default.Router();
exports.surveyRouter = surveyRouter;
surveyRouter.get('/all', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield survey_service_1.default.getAllSurveys();
        res.status(200).json(questions);
    }
    catch (error) {
        res.status(500).json({ message: "Error retriving all questions." });
    }
}));
surveyRouter.post("/:surveyId/question", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const surveyId = parseInt(req.params.surveyId);
    const questionBody = req.body;
    try {
        const question = yield question_service_1.default.createQuestionOnSurvey(questionBody, surveyId);
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
surveyRouter.post("/add/:name", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.params.name;
    const dummySurvey = req.body;
    try {
        const survey = yield survey_service_1.default.createSurvey(dummySurvey, name);
        res.status(200).json(survey);
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
surveyRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const surveyId = parseInt(req.params.id);
    try {
        const survey = yield survey_service_1.default.removeSurveyById(surveyId);
        res.status(200).json(survey);
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
