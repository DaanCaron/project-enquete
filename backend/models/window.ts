import { Question as QuestionPrisma, Window as WindowPrisma } from "@prisma/client"
import { Question } from "./question"

export class Window{
    private id?: number | null
    private background: string

    private question?: Question

    constructor(params: {
        id?: number,
        background: string,
        question?: Question
    }){
        this.id = params.id
        this.background = params.background
        this.question = params.question
    }

    static from(data: WindowPrisma & {question?: QuestionPrisma}): Window {
        return new Window({
            id: data.id,
            background: data.background,
            question: data.question ? Question.from(data.question) : undefined,
        })
    }

    public getId(): number | null | undefined {
        return this.id
    }

    public getBackground(): string{
        return this.background
    }

    public getQuestion(): Question | undefined{
        return this.question
    }

    public setId(id:number) {
        this.id = id
    }

    public setBackground(background: string) {
        this.background = background
    }

    public setQuestion(question: Question) {
        this.question = question
    }
}