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
const button_1 = require("../models/button");
const text_1 = require("../models/text");
const window_1 = require("../models/window");
const window_db_1 = __importDefault(require("../repository/window.db"));
const updateWindow = (window, windowId) => __awaiter(void 0, void 0, void 0, function* () {
    const windowCheck = yield window_db_1.default.getWindowById(windowId);
    if (!windowCheck) {
        throw new Error('No window found with given ID');
    }
    try {
        const windowData = new window_1.Window({
            id: window.id,
            background: window.background,
            buttons: window.buttons.map((button) => new button_1.Button(button)),
            text: new text_1.Text(window.text)
        });
        const windowRes = yield window_db_1.default.updateWindow(windowData, windowId);
        if (!windowRes) {
            throw new Error('No window found with given ID');
        }
        return windowRes;
    }
    catch (error) {
        console.error(error);
        throw new Error('Error Question on given Survey');
    }
});
exports.default = {
    updateWindow
};
