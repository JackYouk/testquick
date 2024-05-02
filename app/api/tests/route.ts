import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { TestRequest } from "@/app/types/test";


export async function POST(request: NextRequest) {

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ status: 401, message: "Unauthenticated" });

  // Check if user is subscribed and number of test gens
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });
  if (!user) return NextResponse.json({ status: 400, message: "No user found" });

  const {
    owner,
    name,
    numberOfquestions,
    courseName,
    courseSubject,
    prompt,
    documentUrls,
  }: TestRequest = await request.json();


  // Retrieve custom OpenAI assistant
  const assistant = await openai.beta.assistants.retrieve(
    "asst_oo2kuH2nFVlzYgdWQPBRbuPN"
  );
  console.log("Retrieved assistant: ", assistant)

  // Upload a files
  const fileIds = await Promise.all(
    documentUrls.map(async (documentUrl) => {
      const file = await openai.files.create({
        file: await fetch(documentUrl),
        purpose: "assistants",
      });
      return file.id;
    })
  );
  console.log("Uploaded Files: ", fileIds)

  // Create user thread
  const systemPrompt = `
    This is important. Generate a ${numberOfquestions} test using the provided file(s) or course document(s) and general subject matter.
    Here are some more instructions to follow when crafting this test: ${prompt}.
    Each question should build in difficulty, and they should illicit a short but in-depth response.
    Format the questions in a JSON object such as {"q1": "question1", "q2": "question2", "q3":"question3"}, and only include this as the response.
    Remember to use both general knowledge of the subject matter and the specific course documents if applicable,
    and that your response must be a JSON object of ${numberOfquestions} questions. Do not include any text in the response, only the JSON object.
  `;
  const thread = await openai.beta.threads.create({
    messages: [
      {
        "role": "user",
        "content": systemPrompt,
        "file_ids": fileIds,
      },
    ],
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

  if (questions && questions.length > 0) {
    // Create prisma test object
    const testWithQuestions = await prisma.test.create({
      data: {
        owner: owner,
        threadId: thread.id,
        testName: name,
        courseName: courseName,
        courseSubject: courseSubject,
        questions: {
          create: questions.map((question) => {
            return { questionText: question };
          }),
        },
      },
      include: {
        questions: true,
      },
    });

    // update user generations +1
    await prisma.user.update({
      where: { email: session?.user?.email as string },
      data: {
        generations: user.generations + 1
      }
    });
    console.log(user)

    const response = new NextResponse(null, {
      status: 201,
    });
    response.headers.set("Location", `/dashboard/tests/build-test/${testWithQuestions.id}`);

    return response;
  } else {
    return NextResponse.json({ status: 500, message: "Error" })
  }

}