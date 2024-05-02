import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    const blob = await put(filename!, request.body!, {
        access: 'public',
    });

    return NextResponse.json({ url: blob.url });
}