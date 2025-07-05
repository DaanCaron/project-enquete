const getAllAnswersByQuestionId = (qid: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/answer/${qid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
}
export default {
    getAllAnswersByQuestionId
}