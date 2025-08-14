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
exports.windowRouter = void 0;
const express_1 = __importDefault(require("express"));
const window_service_1 = __importDefault(require("../services/window.service"));
const windowRouter = express_1.default.Router();
exports.windowRouter = windowRouter;
windowRouter.put("/update/:windowId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const windowId = parseInt(req.params.windowId);
    const windowBody = req.body;
    try {
        const window = yield window_service_1.default.updateWindow(windowBody, windowId);
        res.status(200).json(window);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to update window', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error', error: String(error) });
        }
        // res.status(500).json({message: "Error retriving question with id " + questionId +", on survey " + surveyId + "."})
    }
}));
