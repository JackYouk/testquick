import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(request: NextRequest) {

    const { threadId, hintPrompt, testQuestions, studentResponses } = await request.json();
    if (!threadId || !hintPrompt || !testQuestions || !studentResponses) return NextResponse.json({ status: 404, message: "Missing request details for generating hint" });

    // Retrieve custom OpenAI assistant
    const assistant = await openai.beta.assistants.retrieve(
        "asst_oo2kuH2nFVlzYgdWQPBRbuPN"
    );
    console.log("Retrieved assistant: ", assistant)

    // Retrieve thread
    const thread = await openai.beta.threads.retrieve(threadId);
    console.log("Retrieved thread: ", thread)

    // Create new message
    const systemPrompt = `
        This is important. These are the questions of the test: ${testQuestions}.
        Here are the student's current responses: ${studentResponses}. 
        Give a student a hint for this test. The hint should facilitate the student to come up with their own solution to the test questions. 
        Here are the details of what the student needs help with: ${hintPrompt}. 
        Remember to format the hint in a JSON object such as {"hint": "this is your hint"}, and only include this as the response.
        Remember to use both general knowledge of the subject matter and the specific course documents if applicable,
        and that your response must be a JSON object of the hint. Do not include any text in the response, only the JSON object.
    `;
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: systemPrompt,
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

        const arrayResult = Object.entries(jsonResult).map(([key, value]) => {
            return `${value}`;
        });
        console.log("Parsed array response: ", arrayResult)

        return arrayResult;
    }

    const questions = await waitForCompletion()

    if (!questions) return NextResponse.json({ status: 500, message: "Error creating questions" })

    return NextResponse.json({ status: 200, questions })

}
