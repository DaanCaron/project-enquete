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
const database_1 = __importDefault(require("../util/database"));
const getAllAnswersByQuestionId = (qid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answerPrisma = yield database_1.default.answer.findMany({
            where: {
                questionId: qid
            },
        });
        if (answerPrisma === null) {
            return null;
        }
        return answerPrisma.map((answer) => answer_1.Answer.from(answer));
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
});
const removeAllAnswersForQuestion = (qid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answerPrisma = yield database_1.default.answer.deleteMany({
            where: {
                questionId: qid
            }
        });
        return answerPrisma.count;
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
});
exports.default = {
    getAllAnswersByQuestionId,
    removeAllAnswersForQuestion
};
