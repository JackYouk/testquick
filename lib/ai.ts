import { openai } from "@/lib/openai";

const waitForGenCompletionAndParse = async (threadId: string, runId: string) => {
    let completed = false;
    let failed = false;

    // Function to delay execution for a set amount of time
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    while (!completed && !failed) {
        // Retrieve the current status of the run
        const runStatus = await openai.beta.threads.runs.retrieve(
            threadId,
            runId
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
        threadId
    );
    // console.log("Retrieved messages in thread: ", messages)

    const gptResponseObj = messages.data[0].content[0]
    // console.log("This is the response object: ", gptResponseObj)

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
    // console.log("Parsed json response: ", jsonResult)
    return jsonResult
}

const waitForVectorStoreCompletion = async (vectorStoreId: string) => {
    let completed = false;
    let failed = false;

    // Function to delay execution for a set amount of time
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    while (!completed && !failed) {
        // Retrieve the current status of the run
        const vectorStore = await openai.beta.vectorStores.retrieve(
            vectorStoreId,
        );
        console.log("Retrieved vector store upload status: ", vectorStore);

        // Check if the vectorStore upload's status is 'completed'
        if (vectorStore.status === 'completed') {
            completed = true;
        } else if (vectorStore.status === 'expired') {
            failed = true;
        } else {
            // If not completed, wait for a specified time before checking again
            console.log('vector store upload is in progress, waiting before checking again...');
            await delay(3000); // Wait for 3 seconds
        }
    }

    if (failed) {
        console.error("Vector store upload failed")
        return null;
    };

    console.log('Vector store upload successful');
    return vectorStoreId
}

const uploadFilesToOpenAI = async (documentUrls: string[]) => {
    const fileIds = await Promise.all(
        documentUrls.map(async (documentUrl) => {
            const file = await openai.files.create({
                file: await fetch(documentUrl),
                purpose: "assistants",
            });
            return file.id;
        })
    );
    const vectorStore = await openai.beta.vectorStores.create({
        file_ids: fileIds
    });
    console.log("Vector Store:", vectorStore)
    await waitForVectorStoreCompletion(vectorStore.id)
    return vectorStore
}

export const generateFromNewThread = async (systemPrompt: string, documentUrls: string[]) => {
    const assistant = await openai.beta.assistants.retrieve(
        "asst_oo2kuH2nFVlzYgdWQPBRbuPN"
    );
    console.log("Retrieved assistant: ", assistant)

    const vectorStore = await uploadFilesToOpenAI(documentUrls)

    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: "user",
                content: systemPrompt,
            },
        ],
        tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } }
    });
    console.log("Created Thread: ", thread)

    // Run thread
    const run = await openai.beta.threads.runs.create(
        thread.id,
        {
            assistant_id: assistant.id,
            // instructions: ""
        }
    );
    console.log("Created Run: ", run)

    const generatedJson = await waitForGenCompletionAndParse(thread.id, run.id)

    return { generatedJson, threadId: thread.id }

}


export const generateFromExistingThread = async (threadId: string, systemPrompt: string) => {
    // Retrieve custom OpenAI assistant
    const assistant = await openai.beta.assistants.retrieve(
        "asst_oo2kuH2nFVlzYgdWQPBRbuPN"
    );
    console.log("Retrieved assistant: ", assistant)

    // Retrieve thread
    const thread = await openai.beta.threads.retrieve(threadId);
    console.log("Retrieved thread: ", thread)

    // Create new message
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

    const generatedJson = await waitForGenCompletionAndParse(thread.id, run.id)
    return generatedJson
}