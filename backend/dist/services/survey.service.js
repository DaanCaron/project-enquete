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
const survey_db_1 = __importDefault(require("../repository/survey.db"));
const getAllSurveys = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const surveys = yield survey_db_1.default.getAllSurveys();
        if (!surveys) {
            throw new Error("No question found with given ID");
        }
        return surveys;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error Question on given Survey");
    }
});
const createSurvey = (surveyData, name) => __awaiter(void 0, void 0, void 0, function* () {
    const surveys = yield survey_db_1.default.getAllSurveys();
    if (surveys) {
        for (let i = 0; i < surveys.length; i++) {
            if (surveys[i].getName().toLowerCase() === name.toLowerCase()) {
                throw new Error("Name already exists");
            }
        }
    }
    try {
        const survey = new survey_1.Survey({
            name: surveyData.name,
            questions: surveyData.questions,
        });
        const createdSurvey = yield survey_db_1.default.createSurvey(survey);
        if (!createdSurvey) {
            throw new Error("Failed to create survey");
        }
        return createdSurvey;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error creating survery");
    }
});
const removeSurveyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ id: id });
    // Make sure the survey exists first
    const survey = yield survey_db_1.default.getSurveyById(id); // ✅ added await
    if (!survey) {
        throw new Error("No survey found with given ID");
    }
    try {
        yield survey_db_1.default.deleteSurveyById(id);
        return { message: `Survey with ID ${id} deleted successfully.` };
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to delete survey and related data.");
    }
});
exports.default = {
    getAllSurveys,
    createSurvey,
    removeSurveyById,
};
