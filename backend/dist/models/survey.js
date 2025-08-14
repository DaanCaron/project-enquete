"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = void 0;
const question_1 = require("./question");
class Survey {
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.questions = params.questions;
    }
    static from(data) {
        return new Survey({
            id: data === null || data === void 0 ? void 0 : data.id,
            name: data.name,
            questions: data.questions ? data.questions.map((question) => question_1.Question.from(question)) : []
        });
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getQuestions() {
        return this.questions;
    }
    setId(id) {
        this.id = id;
    }
    setName(name) {
        this.name = name;
    }
    setQuestions(questions) {
        this.questions = questions;
    }
}
exports.Survey = Survey;
