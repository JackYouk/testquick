import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateFromExistingThread } from "@/lib/ai";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const { testId, suggestion, testQuestions } = await request.json();
    const testObj = await prisma.test.findUnique({
        where: {
            id: testId
        },
    });

    if (!testObj) return NextResponse.json({ status: 401, message: "No tests found" });

    const threadId = testObj.threadId
    const systemPrompt = `
        This is important. These are the new questions of the test: ${testQuestions}. Edit the new questions of the test using the following instructions: ${suggestion}. 
        Remember to format the questions in a JSON object such as {"q1": "question1", "q2": "question2", "q3":"question3"}, and only include this as the response.
        Remember to use both general knowledge of the subject matter and the specific course documents if applicable,
        and that your response must be a JSON object of the questions. Do not include any text in the response, only the JSON object.
    `;

    const generatedJson = await generateFromExistingThread(threadId, systemPrompt)
    const arrayResult = Object.entries(generatedJson).map(([key, value]) => {
        return `${value}`;
    });
    console.log("Parsed array response: ", arrayResult)
    const questions = arrayResult;

    if (!questions) return NextResponse.json({ status: 500, message: "Error creating questions" })

    return NextResponse.json({ status: 200, questions })

}
