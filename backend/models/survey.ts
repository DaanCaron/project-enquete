import { Question as QuestionPrisma, Survey as SurveyPrisma } from "@prisma/client";
import { Question } from "./question"

export class Survey{
    private id?: number
    private name: string
    private questions: Question[]

    constructor(params: {
        id?: number
        name: string
        questions: Question[]
    }) {
        this.id = params.id
        this.name = params.name
        this.questions = params.questions
    }

    static from(data: SurveyPrisma & {questions?: QuestionPrisma[] }): Survey{
        return new Survey({
            id: data?.id,
            name: data.name,
            questions: data.questions ? data.questions.map((question) => Question.from(question)): []
        })
    }

    public getId(){
        return this.id
    }

    public getName(){
        return this.name
    }

    public getQuestions(){
        return this.questions
    }

    public setId(id: number){
        this.id = id
    }

    public setName(name:string){
        this.name = name
    }

    public setQuestions(questions: Question[]){
        this.questions = questions
    }
}