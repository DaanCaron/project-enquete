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
const window_1 = require("../models/window");
const database_1 = __importDefault(require("../util/database"));
const updateWindow = (windowData, windowId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    try {
        const windowPrisma = yield database_1.default.window.update({
            where: {
                id: windowId
            },
            data: {
                background: windowData.getBackground(),
                // Delete old buttons and recreate (simplest way to replace array relations)
                buttons: {
                    deleteMany: {}, // delete all existing buttons
                    create: windowData.getButtons().map(button => ({
                        x: button.getX(),
                        y: button.getY(),
                        width: button.getWidth(),
                        height: button.getHeight(),
                        text: button.getText(),
                        weight: button.getWeight()
                    }))
                },
                text: {
                    upsert: {
                        update: {
                            x: (_b = (_a = windowData.getText()) === null || _a === void 0 ? void 0 : _a.getX()) !== null && _b !== void 0 ? _b : 0,
                            y: (_d = (_c = windowData.getText()) === null || _c === void 0 ? void 0 : _c.getY()) !== null && _d !== void 0 ? _d : 0,
                            width: (_f = (_e = windowData.getText()) === null || _e === void 0 ? void 0 : _e.getWidth()) !== null && _f !== void 0 ? _f : 0,
                            height: (_h = (_g = windowData.getText()) === null || _g === void 0 ? void 0 : _g.getHeight()) !== null && _h !== void 0 ? _h : 0,
                        },
                        create: {
                            x: (_k = (_j = windowData.getText()) === null || _j === void 0 ? void 0 : _j.getX()) !== null && _k !== void 0 ? _k : 0,
                            y: (_m = (_l = windowData.getText()) === null || _l === void 0 ? void 0 : _l.getY()) !== null && _m !== void 0 ? _m : 0,
                            width: (_p = (_o = windowData.getText()) === null || _o === void 0 ? void 0 : _o.getWidth()) !== null && _p !== void 0 ? _p : 0,
                            height: (_r = (_q = windowData.getText()) === null || _q === void 0 ? void 0 : _q.getHeight()) !== null && _r !== void 0 ? _r : 0,
                        }
                    }
                }
            },
            include: {
                buttons: true,
                text: true
            }
        });
        return window_1.Window.from(windowPrisma);
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
});
const getWindowById = (windowId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const windowPrisma = yield database_1.default.window.findUnique({
            where: {
                id: windowId
            },
            include: { buttons: false, text: false }
        });
        if (windowPrisma === null) {
            return null;
        }
        return window_1.Window.from(windowPrisma);
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
});
exports.default = {
    updateWindow,
    getWindowById
};
