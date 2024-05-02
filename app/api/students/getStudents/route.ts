import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const email = session?.user?.email;
    if (!email) return NextResponse.json({ status: "400" })

    const user = await prisma.user.findUnique({
        where: {
            email: email as string,
        },
    });
    if (!user) return NextResponse.json({ status: "400" })

    const students = await prisma.student.findMany({
        where: {
            teacherId: user?.id
        },
        include: {
            responses: true,
        },
    })

    return NextResponse.json({ status: 200, students: students.reverse() });
}