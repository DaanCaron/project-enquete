export type Answer = {
    id: number;
    weight: number
    answer: string;
    questionId: number;
}

export type Button = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  windowId: number;
  weight: number
}

export type TextBlock ={
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    windowId: number;
}

export type WindowConfig ={
    id: number;
    background: string;
    buttons: Button[];
    text: TextBlock;
}

export type SurveyData ={
    id: number;
    name: string;
    questions: any[]; 
}

export type Survey ={
    id: number;
    name: string;
    questions: any[]; 
}

export type QuestionData ={
    id: number;
    question: string;
    sequence: number;
    answers: Answer[];
    survey: Survey;
    window: WindowConfig;
    graphStyle: string
}
