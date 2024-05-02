import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function GET(request: NextRequest, { params }: { params: { studentId: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const student = await prisma.student.findUnique({
        where: {
            id: params.studentId
        },
        include: {
            responses: {
                include: {
                    test: true
                }
            }
        },
    });

    return NextResponse.json(student);
}