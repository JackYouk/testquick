import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const { testId, newStatus } = await request.json();

    const updatedTest = await prisma.test.update({
        where: {
            id: testId,
        },
        data: {
            status: newStatus,
        },
    });

    return NextResponse.json({ status: 200, updatedTest });
}