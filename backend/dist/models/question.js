"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const answer_1 = require("./answer");
const window_1 = require("./window");
const survey_1 = require("./survey");
class Question {
    constructor(params) {
        var _a;
        this.id = params.id;
        this.question = params.question;
        this.sequence = params.sequence;
        this.answers = (_a = params.answers) !== null && _a !== void 0 ? _a : [];
        this.survey = params.survey;
        this.window = params.window;
        this.graphStyle = params.graphStyle;
    }
    static from(data) {
        return new Question({
            id: data === null || data === void 0 ? void 0 : data.id,
            question: data.question,
            sequence: data.sequence,
            graphStyle: data.graphStyle,
            answers: data.answers
                ? data.answers.map((answer) => answer_1.Answer.from(answer))
                : [],
            survey: data.survey ? survey_1.Survey.from(data.survey) : undefined,
            window: data.window ? window_1.Window.from(data.window) : undefined,
        });
    }
    getId() {
        return this.id;
    }
    getQuestion() {
        return this.question;
    }
    getSequence() {
        return this.sequence;
    }
    getAnswers() {
        return this.answers;
    }
    getSurvey() {
        return this.survey;
    }
    getWindow() {
        return this.window;
    }
    getGraphStyle() {
        return this.graphStyle;
    }
    // Setters
    setId(id) {
        this.id = id;
    }
    setQuestion(question) {
        this.question = question;
    }
    setSequence(sequence) {
        this.sequence = sequence;
    }
    setAnswers(answers) {
        this.answers = answers;
    }
    setSurvey(survey) {
        this.survey = survey;
    }
    setWindow(window) {
        this.window = window;
    }
}
exports.Question = Question;
