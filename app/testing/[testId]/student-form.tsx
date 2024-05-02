"use client"

import * as React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Student, Test } from "@/app/types/test"


const profileFormSchema = z.object({
    studentId: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(30, {
            message: "Username must not be longer than 30 characters.",
        }),
    class: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(100, {
            message: "Username must not be longer than 100 characters.",
        }),
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(30, {
            message: "Name must not be longer than 30 characters.",
        }),
    email: z
        .string()
        .email({
            message: "Please enter a valid email.",
        }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface StudentFormProps {
    setStudent: (student: Student) => void;
    setFormAnswered: (answered: boolean) => void;
    teacherEmail: string;
    courseName: string;
    testId: string;
    setTestCompleted: (completed: boolean) => void;
}

export function StudentForm({ setFormAnswered, teacherEmail, setStudent, courseName, testId, setTestCompleted }: StudentFormProps) {
    const defaultValues: Partial<ProfileFormValues> = {
        class: courseName
    }
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');

    async function onSubmit(data: ProfileFormValues) {
        setLoading(true);
        try {
            const studentReq = {
                teacherEmail,
                studentId: data.studentId,
                studentName: data.name,
                studentEmail: data.email,
                studentClass: data.class,
            };
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentReq),
            });
            if (!response.ok) {
                throw new Error(`Failed to register student: ${response.statusText}`);
            }
            const { student } = await response.json();
            setStudent(student);
            localStorage.setItem('studentData', JSON.stringify(student));
            const response2 = await fetch(`/api/tests/getResponseByStudent/${testId}?studentId=${student.id}`)
            const studentResponseApiResponse = await response2.json();
            if (studentResponseApiResponse.status === 200) {
                localStorage.setItem(`responses-${testId}`, JSON.stringify(studentResponseApiResponse.studentResponse.questionResponses));
                localStorage.setItem(`feedbacks-${testId}`, JSON.stringify(studentResponseApiResponse.studentResponse.responseFeedbacks));
                localStorage.setItem(`grades-${testId}`, JSON.stringify(studentResponseApiResponse.studentResponse.responseGrades));
                localStorage.setItem(`completed-${testId}`, "true");
                setTestCompleted(true);
            }
            setFormAnswered(true);

        } catch (error) {
            console.error(error);
            setErrorMsg('An unexpected error occurred. Please try again.');
            setError(true);
            setTimeout(() => setError(false), 3500);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Student ID</FormLabel>
                            <FormControl>
                                <Input placeholder="642371" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Class</FormLabel>
                            <FormControl>
                                <Input placeholder="English 1B Fall 2023" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Student X" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="pb-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="example@school.org" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button disabled={loading || error} variant={error ? "destructive" : "default"} className="w-full" type="submit">
                    {error ? <>{errorMsg}</> : loading ? (
                        <svg aria-hidden="true" className="w-6 h-6 text-gray-300 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    ) : 'Save & Continue'}
                </Button>
            </form>
        </Form>
    )
}
