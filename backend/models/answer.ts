// answer.ts
import { Answer as AnswerPrisma } from "@prisma/client";

export class Answer {
    private id?: number;
    private answer: string;
    private questionId?: number | null;

    constructor(params: { id?: number; answer: string; questionId?: number | null }) {
      this.id = params.id;
      this.answer = params.answer;
      this.questionId = params.questionId;
    }

    static from(data: AnswerPrisma): Answer {
      return new Answer({
        id: data.id,
        answer: data.answer,
        questionId: data.questionId
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

    public setId(id: number) {
      this.id = id;
    }
    public setAnswer(answer: string) {
      this.answer = answer;
    }
    public setQuestionId(question: number) {
      this.questionId = question;
    }
}
