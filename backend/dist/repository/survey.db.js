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
const survey_1 = require("../models/survey");
const database_1 = __importDefault(require("../util/database"));
const getSurveyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const surveyPrisma = yield database_1.default.survey.findUnique({
            where: {
                id: id
            },
            include: { questions: true }
        });
        if (surveyPrisma === null) {
            return null;
        }
        return survey_1.Survey.from(surveyPrisma);
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error for events. See server log for details.');
    }
});
const getAllSurveys = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const surveyPrisma = yield database_1.default.survey.findMany({
            include: {
                questions: true
            },
        });
        if (surveyPrisma === null) {
            return null;
        }
        return surveyPrisma.map((survey) => survey_1.Survey.from(survey));
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
});
const createSurvey = (survey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdSurvey = yield database_1.default.survey.create({
            data: {
                name: survey.getName()
            },
            include: { questions: false }
        });
        return survey_1.Survey.from(createdSurvey);
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to add question and related data");
    }
});
const deleteSurveyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.$transaction([
            // Delete all answers for all questions in the survey
            database_1.default.answer.deleteMany({
                where: {
                    question: {
                        survey: { id }
                    }
                }
            }),
            // Delete all buttons linked to windows of questions in this survey
            database_1.default.button.deleteMany({
                where: {
                    window: {
                        question: {
                            survey: { id }
                        }
                    }
                }
            }),
            // Delete all text blocks linked to windows
            database_1.default.text.deleteMany({
                where: {
                    window: {
                        question: {
                            survey: { id }
                        }
                    }
                }
            }),
            // Delete all questions
            database_1.default.question.deleteMany({
                where: {
                    survey: { id }
                }
            }),
            // Delete all windows linked to questions
            database_1.default.window.deleteMany({
                where: {
                    question: {
                        survey: { id }
                    }
                }
            }),
            // Finally, delete the survey itself
            database_1.default.survey.delete({
                where: { id }
            })
        ]);
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error while deleting survey and related data.");
    }
});
exports.default = {
    getSurveyById,
    getAllSurveys,
    createSurvey,
    deleteSurveyById
};
