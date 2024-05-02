import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const tests = await prisma.test.findMany({
        where: {
            owner: `${session.user.email}`
        },
        include: {
            responses: true
        }
    });

    const formattedTests = tests.map((test) => {
        return { ...test, createdAt: formatDate(test.createdAt) }
    })

    return NextResponse.json({ status: 200, formattedTests: formattedTests.reverse() });
}