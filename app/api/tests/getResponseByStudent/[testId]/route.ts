import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request: NextRequest, { params }: { params: { testId: string } }) {

    const url = new URL(request.url);
    const studentResponseId = url.searchParams.get('studentId');
    if (!studentResponseId) {
        return NextResponse.json({ status: 400, message: "StudentId not provided" })
    }

    const studentResponse = await prisma.response.findFirst({
        where: {
            testId: params.testId,
            studentId: studentResponseId
        },
        include: {
            student: true
        }
    })

    if (studentResponse) {
        return NextResponse.json({ status: 200, studentResponse });
    } else {
        return NextResponse.json({ status: 204, message: "Student response not found" })
    }


}