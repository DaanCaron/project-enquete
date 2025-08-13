import { Survey } from "../models/survey";
import database from "../util/database";

const getSurveyById = async (id: number): Promise<Survey | null> =>{
    try{
        const surveyPrisma = await database.survey.findUnique({
            where: {
                id: id
            },
            include: {questions: true}
        })
        if (surveyPrisma === null) {
            return null;
        }
        return Survey.from(surveyPrisma)
    }catch(error){
        console.error(error);
        throw new Error('Database error for events. See server log for details.')
    }
}

const getAllSurveys = async () => {
  try {
    const surveyPrisma = await database.survey.findMany({
      include: {
        questions: true
      },
    });
    if (surveyPrisma === null) {
      return null;
    }
    return surveyPrisma.map((survey) => Survey.from(survey));
  } catch (error) {
    console.error(error);
    throw new Error("Database error for events. See server log for details.");
  }
};

const createSurvey = async (survey: Survey) =>{
  try{
    const createdSurvey = await database.survey.create({
      data:{
        name: survey.getName()
      },
      include: {questions: false}
    })
    return Survey.from(createdSurvey)
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add question and related data");
  }
}

const deleteSurveyById = async (id: number): Promise<void> => {
  try {
    await database.$transaction([
      // Delete all answers for all questions in the survey
      database.answer.deleteMany({
        where: {
          question: {
            survey: { id }
          }
        }
      }),

      // Delete all buttons linked to windows of questions in this survey
      database.button.deleteMany({
        where: {
          window: {
            question: {
              survey: { id }
            }
          }
        }
      }),

      // Delete all text blocks linked to windows
      database.text.deleteMany({
        where: {
          window: {
            question: {
              survey: { id }
            }
          }
        }
      }),

      // Delete all questions
      database.question.deleteMany({
        where: {
          survey: { id }
        }
      }),

      // Delete all windows linked to questions
      database.window.deleteMany({
        where: {
          question: {
            survey: { id }
          }
        }
      }),

      // Finally, delete the survey itself
      database.survey.delete({
        where: { id }
      })
    ]);
  } catch (error) {
    console.error(error);
    throw new Error("Database error while deleting survey and related data.");
  }
};


export default{
    getSurveyById,
    getAllSurveys,
    createSurvey,
    deleteSurveyById
}