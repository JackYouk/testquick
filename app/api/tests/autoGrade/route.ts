import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateFromExistingThread } from "@/lib/ai";


export async function POST(request: NextRequest) {

    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const {
        testQuestionsString,
        questionResponsesString,
        numQuestions,
        threadId,
        testId,
    } = await request.json();


    const autoGradePrompt = `
    This is important. Consider the test that was generated in this message thread.
    As a reminder, the test questions are as follows: ${testQuestionsString}.
    I need you to grade a students response. The students response is as follows: ${questionResponsesString}.
    Please be honest in your grading, the students grade should reflect their understanding of the material and quality of response.
    It is important that you provide a score out of 10 for each of the ${numQuestions} question responses, along with a feedback for each of the ${numQuestions} question responses.

    It is very important that you format your response as a JSON object like this: {"feedbackSuggestions": ["Suggestion1", "Suggestion2", "Suggestion3"], "gradeSuggestions": [9, 10, 6]}. 
    Both of these arrays should be of length ${numQuestions}. Only include this JSON object as the response.
    Remember to use general knowledge of the subject matter, the specific course documents if applicable.
    Reminder: your response should be an JSON object of two arrays, both of length ${numQuestions}. Do not include any text in the response, only the JSON object.
    `;

    const generatedJson = await generateFromExistingThread(threadId, autoGradePrompt);
    if (!generatedJson || !generatedJson.feedbackSuggestions || !generatedJson.gradeSuggestions) return NextResponse.json({ status: 500, message: "Error autograding" })
    const feedbackSuggestions: string[] = generatedJson.feedbackSuggestions;
    const gradeSuggestions: number[] = generatedJson.gradeSuggestions;

    return NextResponse.json({ status: 200, feedbackSuggestions, gradeSuggestions })
}