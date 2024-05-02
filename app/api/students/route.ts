import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(request: NextRequest) {
    const {
        teacherEmail,
        studentId,
        studentName,
        studentEmail,
        studentClass
    } = await request.json();

    // find user/teacher where email matches teacherEmail
    const matchedUser = await prisma.user.findUnique({
        where: {
            email: teacherEmail,
        },
    });

    if (!matchedUser) {
        return NextResponse.json({ status: 404, message: 'Teacher not found' });
    }

    // check for student with matching email
    const matchedStudent = await prisma.student.findUnique({
        where: {
            email: studentEmail,
        },
    });

    if (matchedStudent) {
        // update the matched student
        const updatedStudent = await prisma.student.update({
            where: {
                email: matchedStudent.email
            },
            data: {
                teacherId: matchedUser.id,
                studentId: studentId,
                class: studentClass,
                name: studentName,
                email: studentEmail,
            }
        })
        return NextResponse.json({ status: 200, student: updatedStudent });
    } else {
        // create student
        const newStudent = await prisma.student.create({
            data: {
                teacherId: matchedUser.id,
                studentId: studentId,
                class: studentClass,
                name: studentName,
                email: studentEmail,
            },
        });
        return NextResponse.json({ status: 201, student: newStudent });
    }
}