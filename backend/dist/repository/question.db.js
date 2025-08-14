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
const answer_1 = require("../models/answer");
const question_1 = require("../models/question");
const database_1 = __importDefault(require("../util/database"));
const getAllQuestions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionsPrisma = yield database_1.default.question.findMany({
            include: {
                answers: true,
                survey: true,
                window: { include: { buttons: true, text: true } },
            },
        });
        if (questionsPrisma === null) {
            return null;
        }
        return questionsPrisma.map((question) => question_1.Question.from(question));
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
});
const getQuestionBySequenceAndSurveyId = (sequence, surveyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionPrisma = yield database_1.default.question.findFirst({
            where: {
                sequence: sequence,
                surveyId: surveyId,
            },
            include: {
                answers: true,
                survey: true,
                window: { include: { buttons: true, text: true } },
            },
        });
        if (questionPrisma === null) {
            return null;
        }
        return question_1.Question.from(questionPrisma);
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
});
const getAllQuestionsBySurveyId = (surveyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionsPrisma = yield database_1.default.question.findMany({
            where: {
                surveyId: surveyId,
            },
            include: {
                answers: true,
                survey: true,
                window: { include: { buttons: true, text: true } },
            },
        });
        if (questionsPrisma === null) {
            return null;
        }
        return questionsPrisma.map((question) => question_1.Question.from(question));
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
});
const getQuestionById = (questionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionPrisma = yield database_1.default.question.findUnique({
            where: {
                id: questionId,
            },
            include: { survey: false, window: false, answers: false },
        });
        if (questionPrisma === null) {
            return null;
        }
        return question_1.Question.from(questionPrisma);
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
});
const updateQuestion = (questionData, questionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionPrisma = yield database_1.default.question.update({
            where: {
                id: questionId
            },
            data: {
                id: questionId,
                question: questionData.getQuestion(),
                sequence: questionData.getSequence(),
                graphStyle: questionData.getGraphStyle()
            },
            include: { window: true, survey: true, answers: true }
        });
        return question_1.Question.from(questionPrisma);
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
});
const createQuestion = (question, surveyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const window = question.getWindow(); // Assuming getter returns Window model or undefined
        // Build the data object dynamically to avoid passing undefined for 'window'
        const data = {
            question: question.getQuestion(),
            sequence: question.getSequence(),
            survey: { connect: { id: surveyId } },
            answers: {
                create: question.getAnswers().map((ans) => ({
                    answer: ans.getAnswer(),
                })),
            },
        };
        if (window) {
            data.window = {
                create: {
                    background: window.getBackground(),
                    buttons: {
                        create: window.getButtons().map((btn) => ({
                            x: btn.getX(),
                            y: btn.getY(),
                            width: btn.getWidth(),
                            height: btn.getHeight(),
                            text: btn.getText(),
                        })),
                    },
                    text: (() => {
                        const text = window.getText();
                        if (text &&
                            text.getX() !== undefined &&
                            text.getY() !== undefined &&
                            text.getWidth() !== undefined &&
                            text.getHeight() !== undefined) {
                            return {
                                create: {
                                    x: text.getX(),
                                    y: text.getY(),
                                    width: text.getWidth(),
                                    height: text.getHeight(),
                                },
                            };
                        }
                        return null;
                    })(),
                },
            };
        }
        const createdQuestion = yield database_1.default.question.create({
            data,
            include: {
                survey: true,
                window: { include: { buttons: true, text: true } },
                answers: true,
            },
        });
        return question_1.Question.from(createdQuestion);
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error creating question. See server log for details.");
    }
});
const removeQuestion = (questionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield database_1.default.question.findUnique({
            where: { id: questionId },
            include: {
                window: {
                    include: {
                        buttons: true,
                        text: true,
                    },
                },
                answers: true,
            },
        });
        if (!question) {
            return null;
        }
        // Delete Answers first
        if (question.answers.length) {
            yield database_1.default.answer.deleteMany({
                where: { questionId },
            });
        }
        // Delete Question second (breaks relation with window)
        yield database_1.default.question.delete({
            where: { id: questionId },
        });
        if (question.window) {
            // Delete Buttons
            if (question.window.buttons.length) {
                yield database_1.default.button.deleteMany({
                    where: { windowId: question.window.id },
                });
            }
            // Delete Text
            if (question.window.text) {
                yield database_1.default.text.delete({
                    where: { id: question.window.text.id },
                });
            }
            // Delete Window last
            yield database_1.default.window.delete({
                where: { id: question.window.id },
            });
        }
        return true;
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to delete question and related data");
    }
});
const castVote = (qid, vote, weight) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newVote = yield database_1.default.answer.create({
            data: {
                answer: vote,
                questionId: qid,
                weight: weight
            },
            include: { question: false }
        });
        return answer_1.Answer.from(newVote);
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to delete question and related data");
    }
});
exports.default = {
    getQuestionBySequenceAndSurveyId,
    getAllQuestions,
    getAllQuestionsBySurveyId,
    getQuestionById,
    updateQuestion,
    createQuestion,
    removeQuestion,
    castVote
};
