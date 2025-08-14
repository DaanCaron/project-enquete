"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
class Text {
    constructor(params) {
        this.id = params.id;
        this.x = params.x;
        this.y = params.y;
        this.width = params.width;
        this.height = params.height;
        this.windowId = params.windowId;
    }
    static from(data) {
        return new Text({
            id: data.id,
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            windowId: data.windowId
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
    getWindowId() {
        return this.windowId;
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
    setWindowId(windowId) {
        this.windowId = windowId;
    }
}
exports.Text = Text;
