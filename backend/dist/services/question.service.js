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
const question_1 = require("../models/question");
const window_1 = require("../models/window");
const question_db_1 = __importDefault(require("../repository/question.db"));
const survey_db_1 = __importDefault(require("../repository/survey.db"));
const getAllQuestions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield question_db_1.default.getAllQuestions();
        if (!questions) {
            throw new Error("No question found with given ID");
        }
        return questions;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error Question on given Survey");
    }
});
const getQuestionOnIdAndSurveyId = (questionNumber, surveyId) => __awaiter(void 0, void 0, void 0, function* () {
    const survey = yield survey_db_1.default.getSurveyById(surveyId);
    if (!survey) {
        throw new Error("No survey found with given ID");
    }
    try {
        const question = yield question_db_1.default.getQuestionBySequenceAndSurveyId(questionNumber, surveyId);
        if (!question) {
            throw new Error("No question found with given ID");
        }
        return question;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error Question on given Survey");
    }
});
const getAllQuestionsBySurveyId = (surveyId) => __awaiter(void 0, void 0, void 0, function* () {
    const survey = yield survey_db_1.default.getSurveyById(surveyId);
    if (!survey) {
        throw new Error("No survey found with given ID");
    }
    try {
        const questions = yield question_db_1.default.getAllQuestionsBySurveyId(surveyId);
        if (!questions) {
            throw new Error("No question found with given ID");
        }
        return questions;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error Question on given Survey");
    }
});
const updateQuestions = (question, qid) => __awaiter(void 0, void 0, void 0, function* () {
    const questionCheck = yield question_db_1.default.getQuestionById(qid);
    if (!questionCheck) {
        throw new Error("No question found with given ID");
    }
    try {
        const questionData = new question_1.Question({
            id: question.id,
            question: question.question,
            sequence: question.sequence,
            graphStyle: question.graphStyle
        });
        const questionRes = yield question_db_1.default.updateQuestion(questionData, qid);
        if (!questionRes) {
            throw new Error("Error updating given question");
        }
        return questionRes;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error Question with given ID");
    }
});
const createQuestionOnSurvey = (questionData, surveyId) => __awaiter(void 0, void 0, void 0, function* () {
    const survey = yield survey_db_1.default.getSurveyById(surveyId);
    if (!survey) {
        throw new Error("No survey found with given ID");
    }
    try {
        const question = new question_1.Question({
            question: questionData.question,
            sequence: questionData.sequence,
            graphStyle: questionData.graphStyle,
            survey: survey,
            window: questionData.window
                ? window_1.Window.from(questionData.window)
                : undefined,
        });
        const createdQuestion = yield question_db_1.default.createQuestion(question, surveyId);
        if (!createdQuestion) {
            throw new Error("Failed to create question");
        }
        return createdQuestion;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error creating question on given survey");
    }
});
const removeQuestion = (questionId) => __awaiter(void 0, void 0, void 0, function* () {
    const questionCheck = yield question_db_1.default.getQuestionById(questionId);
    if (!questionCheck) {
        throw new Error("No question found with given ID");
    }
    try {
        const result = yield question_db_1.default.removeQuestion(questionId);
        if (!result) {
            throw new Error("Failed to remove question");
        }
        return true;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error removing question");
    }
});
const castVote = (qid, vote, weight) => __awaiter(void 0, void 0, void 0, function* () {
    const questionCheck = yield question_db_1.default.getQuestionById(qid);
    if (!questionCheck) {
        throw new Error("No question found with given ID");
    }
    try {
        const res = yield question_db_1.default.castVote(qid, vote, weight);
        if (!res) {
            throw new Error("Error adding vote to question");
        }
        return res;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error adding vote to question");
    }
});
exports.default = {
    getQuestionOnIdAndSurveyId,
    getAllQuestions,
    getAllQuestionsBySurveyId,
    updateQuestions,
    createQuestionOnSurvey,
    removeQuestion,
    castVote,
};
