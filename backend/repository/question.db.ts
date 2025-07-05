import { Answer } from "../models/answer";
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

const getQuestionById = async (questionId: number) => {
  try {
    const questionPrisma = await database.question.findUnique({
      where: {
        id: questionId,
      },
      include: { survey: false, window: false, answers: false },
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

const updateQuestion = async (questionData: Question, questionId: number) => {
  try {
      const questionPrisma = await database.question.update({
        where: {
          id: questionId
        },
        data:{
          id: questionId,
          question: questionData.getQuestion(),
          sequence: questionData.getSequence()
        },
        include: {window: true, survey: true, answers: true}
      })
      return Question.from(questionPrisma)
  } catch (error) {
    console.error(error);
    throw new Error("Database error for events. See server log for details.");
  }
};

const createQuestion = async (question: Question, surveyId: number) => {
  try {
    const window = question.getWindow(); // Assuming getter returns Window model or undefined

    // Build the data object dynamically to avoid passing undefined for 'window'
    const data: any = {
      question: question.getQuestion(),
      sequence: question.getSequence(),
      survey: { connect: { id: surveyId } },
      answers: {
        create: question.getAnswers().map((ans) => ({
          answer: ans.getAnswer(),
        })),
      },
    };

    if (window) {
      data.window = {
        create: {
          background: window.getBackground(),
          buttons: {
            create: window.getButtons().map((btn) => ({
              x: btn.getX(),
              y: btn.getY(),
              width: btn.getWidth(),
              height: btn.getHeight(),
              text: btn.getText(),
            })),
          },
          text: (() => {
            const text = window.getText();
            if (
              text &&
              text.getX() !== undefined &&
              text.getY() !== undefined &&
              text.getWidth() !== undefined &&
              text.getHeight() !== undefined
            ) {
              return {
                create: {
                  x: text.getX(),
                  y: text.getY(),
                  width: text.getWidth(),
                  height: text.getHeight(),
                },
              };
            }
            return null;
          })(),
        },
      };
    }

    const createdQuestion = await database.question.create({
      data,
      include: {
        survey: true,
        window: { include: { buttons: true, text: true } },
        answers: true,
      },
    });

    return Question.from(createdQuestion);
  } catch (error) {
    console.error(error);
    throw new Error("Database error creating question. See server log for details.");
  }
};

const removeQuestion = async (questionId: number) => {
  try {
    const question = await database.question.findUnique({
      where: { id: questionId },
      include: {
        window: {
          include: {
            buttons: true,
            text: true,
          },
        },
        answers: true,
      },
    });

    if (!question) {
      return null;
    }

    // Delete Answers first
    if (question.answers.length) {
      await database.answer.deleteMany({
        where: { questionId },
      });
    }

    // Delete Question second (breaks relation with window)
    await database.question.delete({
      where: { id: questionId },
    });

    if (question.window) {
      // Delete Buttons
      if (question.window.buttons.length) {
        await database.button.deleteMany({
          where: { windowId: question.window.id },
        });
      }

      // Delete Text
      if (question.window.text) {
        await database.text.delete({
          where: { id: question.window.text.id },
        });
      }

      // Delete Window last
      await database.window.delete({
        where: { id: question.window.id },
      });
    }

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete question and related data");
  }
};

const castVote = async (qid: number, vote: string) => {
  try {
    const newVote = await database.answer.create({
      data: {
        answer: vote,
        questionId: qid
      },
      include: {question: false}
    })
    return Answer.from(newVote)
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete question and related data");
  }
}


export default {
  getQuestionBySequenceAndSurveyId,
  getAllQuestions,
  getAllQuestionsBySurveyId,
  getQuestionById,
  updateQuestion,
  createQuestion,
  removeQuestion,
  castVote
};
