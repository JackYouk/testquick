import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestRequest } from "@/app/types/test";
import { generateFromNewThread } from "@/lib/ai";


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

  const systemPrompt = `
    This is important. Generate a ${numberOfquestions} test using the provided file(s) or course document(s) and general subject matter.
    Here are some more instructions to follow when crafting this test: ${prompt}.
    Each question should build in difficulty, and they should illicit a short but in-depth response.
    Format the questions in a JSON object such as {"q1": "question1", "q2": "question2", "q3":"question3"}, and only include this as the response.
    Remember to use both general knowledge of the subject matter and the specific course documents if applicable,
    and that your response must be a JSON object of ${numberOfquestions} questions. Do not include any text in the response, only the JSON object.
  `;

  const { generatedJson, threadId } = await generateFromNewThread(systemPrompt, documentUrls)
  const arrayResult = Object.entries(generatedJson).map(([key, value]) => {
    return `${value}`;
  });
  console.log("Parsed array response: ", arrayResult)
  const questions = arrayResult;

  if (questions && questions.length > 0) {
    // Create prisma test object
    const testWithQuestions = await prisma.test.create({
      data: {
        owner: owner,
        threadId: threadId,
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