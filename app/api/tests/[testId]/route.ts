import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function GET(request: NextRequest, { params }: { params: { testId: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const test = await prisma.test.findUnique({
        where: {
            id: params.testId
        },
        include: {
            questions: true,
            responses: {
                include: {
                    student: true
                }
            }
        },
    });

    return NextResponse.json(test);
}