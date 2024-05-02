import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Question } from "@prisma/client";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const { testId, newQuestions } = await request.json();

    await prisma.question.deleteMany({
        where: {
            testId: testId,
        },
    });

    const updatedTest = await prisma.test.update({
        where: {
            id: testId,
        },
        data: {
            questions: {
                create: newQuestions.map((question: Question) => {
                    return { questionText: question };
                }),
            },
        },
        include: {
            questions: true,
        },
    });

    return NextResponse.json({ status: 200, updatedTest })

}