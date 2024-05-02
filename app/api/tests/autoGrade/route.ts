import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { openai } from "@/lib/openai";


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


    // Retrieve custom OpenAI assistant
    const assistant = await openai.beta.assistants.retrieve(
        "asst_oo2kuH2nFVlzYgdWQPBRbuPN"
    );
    console.log("Retrieved assistant: ", assistant)

    // Retrieve thread
    const thread = await openai.beta.threads.retrieve(threadId);
    console.log("Retrieved thread: ", thread)

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

    // Create new message
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: autoGradePrompt,
        }
    );
    console.log("Created new message: ", message)

    // Run thread
    const run = await openai.beta.threads.runs.create(
        thread.id,
        {
            assistant_id: assistant.id,
            // instructions: ""
        }
    );
    console.log("Created Run: ", run)

    // Wait for run to complete
    const waitForCompletion = async () => {
        let completed = false;
        let failed = false;

        // Function to delay execution for a set amount of time
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        while (!completed && !failed) {
            // Retrieve the current status of the run
            const runStatus = await openai.beta.threads.runs.retrieve(
                thread.id,
                run.id
            );
            console.log("Retrieved run status: ", runStatus);

            // Check if the run's status is 'completed'
            if (runStatus.status === 'completed') {
                completed = true;
            } else if (runStatus.status === 'failed') {
                failed = true;
            } else {
                // If not completed, wait for a specified time before checking again
                console.log('Run is in progress, waiting before checking again...');
                await delay(3000); // Wait for 3 seconds
            }
        }

        if (failed) {
            console.error("Run failed")
            return null;
        };

        console.log('Run successful');

        // Retrieve all messages in thread
        const messages = await openai.beta.threads.messages.list(
            thread.id
        );
        console.log("Retrieved messages in thread: ", messages)

        const gptResponseObj = messages.data[0].content[0]
        console.log("This is the response object: ", gptResponseObj)

        if (gptResponseObj.type != "text") return;

        const parseToJson = () => {
            let jsonString = gptResponseObj.text.value;
            const jsonPattern = /{[\s\S]*}/;
            const match = jsonString.match(jsonPattern);
            if (match) {
                jsonString = match[0];
            }
            try {
                const jsonData = JSON.parse(jsonString);
                return jsonData;
            } catch (error) {
                console.error("Parsing error:", error);
            }
        }

        const jsonResult = parseToJson()
        console.log("Parsed json response: ", jsonResult)
        const feedbackSuggestions: string[] = jsonResult.feedbackSuggestions;
        const gradeSuggestions: number[] = jsonResult.gradeSuggestions;

        return { feedbackSuggestions, gradeSuggestions }
    }

    const gptResponse = await waitForCompletion();

    if (!gptResponse || !gptResponse.feedbackSuggestions || !gptResponse.gradeSuggestions) return NextResponse.json({ status: 500, message: "Error autograding" })

    return NextResponse.json({ status: 200, feedbackSuggestions: gptResponse.feedbackSuggestions, gradeSuggestions: gptResponse.gradeSuggestions })

}