import answerDb from "../repository/answer.db";
import questionDb from "../repository/question.db";

const getAllAnswersByQuestionId = async (qid: number) => {
  const questionCheck = await questionDb.getQuestionById(qid);

  if (!questionCheck) {
    throw new Error("No question found with given ID");
  }

  try{
    const answer = await answerDb.getAllAnswersByQuestionId(qid)

    if(!answer){
        throw new Error("Error retrieving all answers on given question");
    }
    return answer
  }catch (error) {
    console.error(error);
    throw new Error("Error answers, could not be retrieved");
  }
};

export default {
  getAllAnswersByQuestionId,
};
