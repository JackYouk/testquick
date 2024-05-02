import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {

    const {
        studentId,
        testId,
        questionResponses,
    } = await request.json();

    // create response object with reqs prisma
    const responseObj = await prisma.response.create({
        data: {
            studentId: studentId,
            testId: testId,
            questionResponses: questionResponses,
            responseGrades: [],
            responseFeedbacks: []
        },
    });

    // TODO set student status to needsGrade
    await prisma.student.update({
        where: { id: studentId },
        data: {
            testingStatus: "needsGrade"
        }
    })

    return NextResponse.json({ status: 200, responseObj })
}