import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request: NextRequest, { params }: { params: { testId: string } }) {
    const test = await prisma.test.findUnique({
        where: {
            id: params.testId
        },
        include: {
            questions: true,
        },
    });

    return NextResponse.json(test);
}