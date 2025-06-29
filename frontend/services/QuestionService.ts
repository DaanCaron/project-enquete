const getQuestionBySequenceAndSurveyId = async (sequence: number, survey:number) =>{
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/${survey}/${sequence}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
}

export default{
    getQuestionBySequenceAndSurveyId
}