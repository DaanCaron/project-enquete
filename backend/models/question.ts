import {
  Question as QuestionPrisma,
  Answer as AnswerPrisma,
} from "@prisma/client";
import { Answer } from "./answer";

export class Question {
    private id?: number | null;
    private question: string;
    private sequence: number;
    private answers: Answer[];    
    private surveyId: number | null

    constructor(params: {
      id?: number;
      question: string;
      sequence: number;
      answers?: Answer[];
      surveyId: number | null
    }) {
      this.id = params.id;
      this.question = params.question;
      this.sequence = params.sequence;
      this.answers = params.answers ?? [];
      this.surveyId = params.surveyId
    } 

    static from(data: QuestionPrisma & { answers?: AnswerPrisma[] }): Question {
      return new Question({
        id: data?.id,
        question: data.question,
        sequence: data.sequence,
        answers: data.answers
          ? data.answers.map((answer) => Answer.from(answer))
          : [],
        surveyId: data.surveyId
      });
    } 

    public getId(): number | null | undefined {
      return this.id;
    } 

    public getQuestion(): string {
      return this.question;
    } 

    public getSequence(): number {
      return this.sequence;
    } 

    public getAnswers(): Answer[] {
      return this.answers;
    } 

    // Setters
    public setId(id: number): void {
      this.id = id;
    } 

    public setQuestion(question: string): void {
      this.question = question;
    } 

    public setSequence(sequence: number): void {
      this.sequence = sequence;
    } 

    public setAnswers(answers: Answer[]): void {
      this.answers = answers;
    }
}
