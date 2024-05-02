import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
        return NextResponse.json({ status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email as string,
            },
        });

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found.' });
        }

        return NextResponse.json({ status: 200, user });

    } catch (error) {
        return NextResponse.json({ status: 500, message: 'Something went wrong' });
    }
};