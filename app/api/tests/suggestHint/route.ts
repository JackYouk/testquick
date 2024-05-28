import { NextRequest, NextResponse } from "next/server";
import { generateFromExistingThread } from "@/lib/ai";

export async function POST(request: NextRequest) {

    const { threadId, hintPrompt, testQuestions, studentResponses } = await request.json();
    if (!threadId || !hintPrompt || !testQuestions || !studentResponses) return NextResponse.json({ status: 404, message: "Missing request details for generating hint" });

    const systemPrompt = `
        This is important. These are the questions of the test: ${testQuestions}.
        Here are the student's current responses: ${studentResponses}. 
        Give a student a hint for this test. The hint should facilitate the student to come up with their own solution to the test questions. 
        Here are the details of what the student needs help with: ${hintPrompt}. 
        Remember to format the hint in a JSON object such as {"hint": "this is your hint"}, and only include this as the response.
        Remember to use both general knowledge of the subject matter and the specific course documents if applicable,
        and that your response must be a JSON object of the hint. Do not include any text in the response, only the JSON object.
    `;

    const generatedJson = await generateFromExistingThread(threadId, systemPrompt)
    const hint = generatedJson.hint

    if (!hint) return NextResponse.json({ status: 500, message: "Error creating questions" })

    return NextResponse.json({ status: 200, hint })
}
