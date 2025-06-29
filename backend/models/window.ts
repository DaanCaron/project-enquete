import { Question as QuestionPrisma, Window as WindowPrisma, Button as ButtonPrisma, Text as TextPrisma } from "@prisma/client"
import { Question } from "./question"
import { Button } from "./button"
import { Text } from "./text"

export class Window{
    private id?: number | null
    private background: string

    private question?: Question
    private buttons: Button[]
    private text?: Text

    constructor(params: {
        id?: number,
        background: string,
        question?: Question
        buttons: Button[]
        text?: Text
    }){
        this.id = params.id
        this.background = params.background
        this.question = params.question
        this.buttons = params.buttons
        this.text = params.text
    }

    static from(data: WindowPrisma & {question?: QuestionPrisma, buttons?: ButtonPrisma[], text?: TextPrisma}): Window {
        return new Window({
            id: data.id,
            background: data.background,
            question: data.question ? Question.from(data.question) : undefined,
            buttons: data.buttons ? data.buttons.map((button) => Button.from(button)) : [],
            text: data.text ? Text.from(data.text) : undefined,
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

    public getButtons() {
        return this.buttons
    } 

    public getText() {
        return this.text
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

    public setButtons(buttons: Button[]){
        this.buttons = buttons
    }
}