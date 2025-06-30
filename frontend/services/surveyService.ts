const getAllSurveys = async () =>{
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/survey/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
}

export default{
    getAllSurveys
}