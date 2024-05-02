import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const { id, responseGrades, responseFeedbacks, studentId } = await request.json();

    // update response
    const updatedResponse = await prisma.response.update({
        where: { id },
        data: {
            responseGrades: responseGrades,
            responseFeedbacks: responseFeedbacks,
        },
    });

    // set student status to graded
    await prisma.student.update({
        where: { id: studentId },
        data: {
            testingStatus: "graded"
        }
    })

    return NextResponse.json({ status: 200, updatedResponse });
}