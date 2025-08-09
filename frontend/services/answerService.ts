const getAllAnswersByQuestionId = (qid: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/answer/${qid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
}

const removeAllAnswersForQuestion = (qid: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/answer/${qid}/remove/all`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
}
export default {
    getAllAnswersByQuestionId,
    removeAllAnswersForQuestion
}