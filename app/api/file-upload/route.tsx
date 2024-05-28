// VERCEL BLOB ---------------------------------------------------------------------
// import { NextRequest, NextResponse } from "next/server";
// import { put } from "@vercel/blob";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function POST(request: NextRequest) {
//     const session = await getServerSession(authOptions);
//     if (!session?.user) return NextResponse.json({ status: 401, message: "Unauthenticated" });

//     const { searchParams } = new URL(request.url);
//     const filename = searchParams.get('filename');

//     const blob = await put(filename!, request.body!, {
//         access: 'public',
//     });

//     return NextResponse.json({ url: blob.url });
// }

// FIREBASE FILE STORAGE ---------------------------------------------------------------------
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadBytes, storage, ref, getDownloadURL } from "@/lib/firebase";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user)
        return NextResponse.json({ status: 401, message: "Unauthenticated" });

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    const fileUploadTimestamp = new Date().getTime();
    const fileUploadRef = `${fileUploadTimestamp}_${filename}`;
    const firebaseStorageRef = ref(storage, fileUploadRef);

    // Convert the request body to a Uint8Array
    const bytes = await request.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);

    const snapshot = await uploadBytes(firebaseStorageRef, uint8Array);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return NextResponse.json({ url: downloadUrl });
}