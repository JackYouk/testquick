import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function POST(request: NextRequest) {

    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const { testId } = await request.json();

    await prisma.question.deleteMany({
        where: { testId: testId }
    });

    await prisma.response.deleteMany({
        where: { testId: testId }
    });

    const deletedTest = await prisma.test.delete({
        where: { id: testId }
    });


    return NextResponse.json({ status: 200, deletedTest });
}