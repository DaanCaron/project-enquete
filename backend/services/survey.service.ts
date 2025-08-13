import { Survey } from "../models/survey";
import surveyDb from "../repository/survey.db";
import { SurveyData } from "../types";

const getAllSurveys = async (): Promise<Survey[] | null> => {
  try {
    const surveys = await surveyDb.getAllSurveys();

    if (!surveys) {
      throw new Error("No question found with given ID");
    }
    return surveys;
  } catch (error) {
    console.error(error);
    throw new Error("Error Question on given Survey");
  }
};

const createSurvey = async (surveyData: SurveyData, name: string) => {
  const surveys = await surveyDb.getAllSurveys();

  if (surveys) {
    for (let i = 0; i < surveys.length; i++) {
      if (surveys[i].getName().toLowerCase() === name.toLowerCase()) {
        throw new Error("Name already exists");
      }
    }
  }
  try {
    const survey = new Survey({
      name: surveyData.name,
      questions: surveyData.questions,
    });

    const createdSurvey = await surveyDb.createSurvey(survey);

    if (!createdSurvey) {
      throw new Error("Failed to create survey");
    }
    return createdSurvey;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating survery");
  }
};

const removeSurveyById = async (id: number) => {
    console.log({id: id})
  // Make sure the survey exists first
  const survey = await surveyDb.getSurveyById(id); // ✅ added await

  if (!survey) {
    throw new Error("No survey found with given ID");
  }

  try {
    await surveyDb.deleteSurveyById(id);
    return { message: `Survey with ID ${id} deleted successfully.` };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete survey and related data.");
  }
};


export default {
  getAllSurveys,
  createSurvey,
  removeSurveyById,
};
