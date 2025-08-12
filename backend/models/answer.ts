// answer.ts
import { Answer as AnswerPrisma } from "@prisma/client";

export class Answer {
    private id?: number;
    private answer: string;
    private questionId?: number | null;
    private weight: number

    constructor(params: { id?: number; answer: string; questionId?: number | null; weight: number }) {
      this.id = params.id;
      this.answer = params.answer;
      this.questionId = params.questionId;
      this.weight = params.weight
    }

    static from(data: AnswerPrisma): Answer {
      return new Answer({
        id: data.id,
        answer: data.answer,
        questionId: data.questionId,
        weight: data.weight
      });
    }

    public getId() {
      return this.id;
    }
    public getAnswer() {
      return this.answer;
    }
    public getQuestionId() {
      return this.questionId;
    }
    public getWeight(){
      return this.weight
    }

    public setId(id: number) {
      this.id = id;
    }
    public setAnswer(answer: string) {
      this.answer = answer;
    }
    public setQuestionId(question: number) {
      this.questionId = question;
    }
    public setWeight(weight: number){
      this.weight = weight
    }
}
