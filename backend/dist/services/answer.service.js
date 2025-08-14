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
const answer_db_1 = __importDefault(require("../repository/answer.db"));
const question_db_1 = __importDefault(require("../repository/question.db"));
const getAllAnswersByQuestionId = (qid) => __awaiter(void 0, void 0, void 0, function* () {
    const questionCheck = yield question_db_1.default.getQuestionById(qid);
    if (!questionCheck) {
        throw new Error("No question found with given ID");
    }
    try {
        const answer = yield answer_db_1.default.getAllAnswersByQuestionId(qid);
        if (!answer) {
            throw new Error("Error retrieving all answers on given question");
        }
        return answer;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error answers, could not be retrieved");
    }
});
const removeAllAnswersForQuestion = (qid) => __awaiter(void 0, void 0, void 0, function* () {
    const questionCheck = yield question_db_1.default.getQuestionById(qid);
    const answers = yield answer_db_1.default.getAllAnswersByQuestionId(qid);
    if (!questionCheck) {
        throw new Error("No question found with given ID");
    }
    if ((answers !== null && answers !== void 0 ? answers : []).length > 0) {
        try {
            const ans = yield answer_db_1.default.removeAllAnswersForQuestion(qid);
            if (!ans) {
                throw new Error("Error removing all answers on given question");
            }
            return ans;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error answers, could not be retrieved");
        }
    }
    else {
        return 0;
    }
});
exports.default = {
    getAllAnswersByQuestionId,
    removeAllAnswersForQuestion,
};
