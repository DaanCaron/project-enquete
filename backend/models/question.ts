import {
  Question as QuestionPrisma,
  Answer as AnswerPrisma,
  Window as WindowPrisma,
  Survey as SurveyPrisma
} from "@prisma/client";
import { Answer } from "./answer";
import { Window } from "./window";
import { Survey } from "./survey";

export class Question {
    private id?: number | null;
    private question: string;
    private sequence: number;
    private graphStyle: string;
    
    private answers: Answer[];    
    private survey?: Survey
    private window?: Window

    constructor(params: {
      id?: number;
      question: string;
      sequence: number;
      answers?: Answer[];
      survey?: Survey
      window?: Window
      graphStyle: string
    }) {
      this.id = params.id;
      this.question = params.question;
      this.sequence = params.sequence;
      this.answers = params.answers ?? [];
      this.survey = params.survey
      this.window = params.window
      this.graphStyle = params.graphStyle
    } 

    static from(data: QuestionPrisma & { answers?: AnswerPrisma[], survey?: SurveyPrisma, window?: WindowPrisma }): Question {
      return new Question({
        id: data?.id,
        question: data.question,
        sequence: data.sequence,
        graphStyle: data.graphStyle,
        answers: data.answers
          ? data.answers.map((answer) => Answer.from(answer))
          : [],
        survey: data.survey ? Survey.from(data.survey) : undefined,
        window: data.window ? Window.from(data.window) : undefined,
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

    public getSurvey(){
        return this.survey
    } 

    public getWindow(){
      return this.window
    } 
    public getGraphStyle(){
      return this.graphStyle
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

    public setSurvey(survey: Survey): void {
      this.survey = survey
    }

    public setWindow(window: Window){
      this.window = window
    }
}
