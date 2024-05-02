import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
        return NextResponse.json({ status: "400" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email as string,
            },
            select: {
                newUser: true
            }
        });

        if (!user) {
            return NextResponse.json({ status: "404", message: 'User not found.' });
        }

        if (user.newUser) {
            await prisma.user.update({
                where: {
                    email: email as string,
                },
                data: {
                    newUser: false,
                },
            });
            return NextResponse.json({newUser: true})
        } else {
            return NextResponse.json({newUser: false})
        }

    } catch (error) {
        return NextResponse.json({ status: "500", message: 'Something went wrong' });
    }
};