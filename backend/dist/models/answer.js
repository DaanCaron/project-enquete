"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer = void 0;
class Answer {
    constructor(params) {
        this.id = params.id;
        this.answer = params.answer;
        this.questionId = params.questionId;
        this.weight = params.weight;
    }
    static from(data) {
        return new Answer({
            id: data.id,
            answer: data.answer,
            questionId: data.questionId,
            weight: data.weight
        });
    }
    getId() {
        return this.id;
    }
    getAnswer() {
        return this.answer;
    }
    getQuestionId() {
        return this.questionId;
    }
    getWeight() {
        return this.weight;
    }
    setId(id) {
        this.id = id;
    }
    setAnswer(answer) {
        this.answer = answer;
    }
    setQuestionId(question) {
        this.questionId = question;
    }
    setWeight(weight) {
        this.weight = weight;
    }
}
exports.Answer = Answer;
