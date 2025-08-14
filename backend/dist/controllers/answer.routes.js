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
exports.answerRouter = void 0;
const express_1 = __importDefault(require("express"));
const answer_service_1 = __importDefault(require("../services/answer.service"));
const answerRouter = express_1.default.Router();
exports.answerRouter = answerRouter;
answerRouter.get('/:qid', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const qid = parseInt(req.params.qid);
    try {
        const response = yield answer_service_1.default.getAllAnswersByQuestionId(qid);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ message: "Error retriving all anwers for given question." });
    }
}));
answerRouter.delete('/:qid/remove/all', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const qid = parseInt(req.params.qid);
    try {
        const response = yield answer_service_1.default.removeAllAnswersForQuestion(qid);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ message: "Error removing all anwers for given question." });
    }
}));
