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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.answer.deleteMany();
    yield prisma.button.deleteMany();
    yield prisma.text.deleteMany();
    yield prisma.question.deleteMany();
    yield prisma.window.deleteMany();
    yield prisma.survey.deleteMany();
    yield prisma.user.deleteMany();
    const survey = yield prisma.survey.create({
        data: {
            name: "Candy survey",
        },
    });
    const window1 = yield prisma.window.create({
        data: {
            background: "#6765f0",
            buttons: {
                create: [
                    { x: 700, y: 500, width: 200, height: 100, text: "Yes", weight: 100 },
                    { x: 1000, y: 500, width: 200, height: 100, text: "No", weight: 0 },
                ],
            },
            text: {
                create: {
                    x: 960,
                    y: 200,
                    width: 400,
                    height: 100,
                },
            },
        },
    });
    const question1 = yield prisma.question.create({
        data: {
            question: "Was the candy tasty?",
            sequence: 1,
            survey: {
                connect: { id: survey.id },
            },
            window: {
                connect: { id: window1.id },
            },
        },
    });
    const window2 = yield prisma.window.create({
        data: {
            background: "#07f5f0",
            buttons: {
                create: [
                    { x: 650, y: 500, width: 200, height: 100, text: "Yes", weight: 100 },
                    { x: 1100, y: 500, width: 200, height: 100, text: "No", weight: 0 },
                    { x: 1100, y: 500, width: 200, height: 100, text: "Non opinion", weight: 50 },
                ],
            },
            text: {
                create: {
                    x: 460,
                    y: 200,
                    width: 400,
                    height: 100,
                },
            },
        },
    });
    const question2 = yield prisma.question.create({
        data: {
            question: "Was it a candy tasty?",
            sequence: 2,
            survey: {
                connect: { id: survey.id },
            },
            window: {
                connect: { id: window2.id },
            },
        },
    });
    const survey2 = yield prisma.survey.create({
        data: {
            name: "test survey",
        },
    });
    const window3 = yield prisma.window.create({
        data: {
            background: "#ef65f0",
            buttons: {
                create: [
                    { x: 700, y: 500, width: 200, height: 100, text: "Yes", weight: 100 },
                    { x: 1000, y: 500, width: 200, height: 100, text: "No", weight: 0 },
                ],
            },
            text: {
                create: {
                    x: 960,
                    y: 200,
                    width: 400,
                    height: 100,
                },
            },
        },
    });
    const question3 = yield prisma.question.create({
        data: {
            question: "Was the test easy?",
            sequence: 1,
            survey: {
                connect: { id: survey2.id },
            },
            window: {
                connect: { id: window3.id },
            },
        },
    });
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield main();
        yield prisma.$disconnect();
    }
    catch (error) {
        console.error(error);
        yield prisma.$disconnect();
        process.exit(1);
    }
}))();
