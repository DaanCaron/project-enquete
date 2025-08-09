import answerDb from "../repository/answer.db";
import questionDb from "../repository/question.db";

const getAllAnswersByQuestionId = async (qid: number) => {
  const questionCheck = await questionDb.getQuestionById(qid);

  if (!questionCheck) {
    throw new Error("No question found with given ID");
  }

  try {
    const answer = await answerDb.getAllAnswersByQuestionId(qid);

    if (!answer) {
      throw new Error("Error retrieving all answers on given question");
    }
    return answer;
  } catch (error) {
    console.error(error);
    throw new Error("Error answers, could not be retrieved");
  }
};

const removeAllAnswersForQuestion = async (qid: number) => {
  const questionCheck = await questionDb.getQuestionById(qid);
  const answers = await answerDb.getAllAnswersByQuestionId(qid);

  if (!questionCheck) {
    throw new Error("No question found with given ID");
  }
  if ((answers ?? []).length > 0) {
    try {
      const ans = await answerDb.removeAllAnswersForQuestion(qid);

      if (!ans) {
        throw new Error("Error removing all answers on given question");
      }
      return ans;
    } catch (error) {
      console.error(error);
      throw new Error("Error answers, could not be retrieved");
    }
  }else{
    return 0
  }
};

export default {
  getAllAnswersByQuestionId,
  removeAllAnswersForQuestion,
};
