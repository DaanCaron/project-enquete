"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Window = void 0;
const question_1 = require("./question");
const button_1 = require("./button");
const text_1 = require("./text");
class Window {
    constructor(params) {
        this.id = params.id;
        this.background = params.background;
        this.question = params.question;
        this.buttons = params.buttons;
        this.text = params.text;
    }
    static from(data) {
        return new Window({
            id: data.id,
            background: data.background,
            question: data.question ? question_1.Question.from(data.question) : undefined,
            buttons: data.buttons ? data.buttons.map((button) => button_1.Button.from(button)) : [],
            text: data.text ? text_1.Text.from(data.text) : undefined,
        });
    }
    getId() {
        return this.id;
    }
    getBackground() {
        return this.background;
    }
    getQuestion() {
        return this.question;
    }
    getButtons() {
        return this.buttons;
    }
    getText() {
        return this.text;
    }
    setId(id) {
        this.id = id;
    }
    setBackground(background) {
        this.background = background;
    }
    setQuestion(question) {
        this.question = question;
    }
    setButtons(buttons) {
        this.buttons = buttons;
    }
}
exports.Window = Window;
