import { Question } from "../models/question";
import database from "../util/database";

const getAllQuestions = async () => {
  try {
    const questionsPrisma = await database.question.findMany({
      include: {
        answers: true,
        survey: true,
        window: { include: { buttons: true, text: true } },
      },
    });
    if (questionsPrisma === null) {
      return null;
    }
    return questionsPrisma.map((question) => Question.from(question));
  } catch (error) {
    console.error(error);
    throw new Error("Database error for events. See server log for details.");
  }
};

const getQuestionBySequenceAndSurveyId = async (
  sequence: number,
  surveyId: number
) => {
  try {
    const questionPrisma = await database.question.findFirst({
      where: {
        sequence: sequence,
        surveyId: surveyId,
      },
      include: {
        answers: true,
        survey: true,
        window: { include: { buttons: true, text: true } },
      },
    });
    if (questionPrisma === null) {
      return null;
    }
    return Question.from(questionPrisma);
  } catch (error) {
    console.error(error);
    throw new Error("Database error for events. See server log for details.");
  }
};

const getAllQuestionsBySurveyId = async (surveyId: number) => {
  try {
    const questionsPrisma = await database.question.findMany({
      where: {
        surveyId: surveyId,
      },
      include: {
        answers: true,
        survey: true,
        window: { include: { buttons: true, text: true } },
      },
    });
    if (questionsPrisma === null) {
      return null;
    }
    return questionsPrisma.map((question) => Question.from(question));
  } catch (error) {
    console.error(error);
    throw new Error("Database error for events. See server log for details.");
  }
};

export default {
  getQuestionBySequenceAndSurveyId,
  getAllQuestions,
  getAllQuestionsBySurveyId,
};
