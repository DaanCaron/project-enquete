"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const window_1 = require("./window");
class Button {
    constructor(params) {
        this.id = params.id;
        this.x = params.x;
        this.y = params.y;
        this.width = params.width;
        this.height = params.height;
        this.text = params.text;
        this.window = params.window;
        this.weight = params.weight;
    }
    static from(data) {
        return new Button({
            id: data.id,
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            text: data.text,
            window: data.window ? window_1.Window.from(data.window) : undefined,
            weight: data.weight
        });
    }
    getId() {
        return this.id;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    getText() {
        return this.text;
    }
    getWindow() {
        return this.window;
    }
    getWeight() {
        return this.weight;
    }
    setId(id) {
        this.id = id;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    setWidth(width) {
        this.width = width;
    }
    setHeight(height) {
        this.height = height;
    }
    setText(text) {
        this.text = text;
    }
    setWindow(window) {
        this.window = window;
    }
    setWeight(weight) {
        this.weight = weight;
    }
}
exports.Button = Button;
