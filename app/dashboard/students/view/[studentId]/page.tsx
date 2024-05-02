"use client"

import { Response, Student } from "@/app/types/test";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { LineGraph } from "@/components/graphs/line-graph";
import { ArrowBigLeftIcon, ArrowLeftCircleIcon, CameraIcon, DownloadIcon, Link2Icon, LinkIcon, PenBoxIcon, Pencil, Trash } from "lucide-react";
import { EyeClosedIcon, LinkBreak1Icon, LinkBreak2Icon, LockClosedIcon, LockOpen1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BarGraph } from "@/components/graphs/bar-graph";
import { calculateAverage } from "@/lib/utils";

export default function StudentPage({ params }: { params: { studentId: string } }) {
    const router = useRouter();
    const studentId = params.studentId;

    const [loading, setLoading] = useState<boolean>(false);
    const [student, setStudent] = useState<Student>();

    const getStudent = async () => {
        setLoading(true);
        const response = await fetch(`/api/students/${studentId}`)
        const matchedStudent = await response.json() as Student & { responses: Response[] }
        console.log(matchedStudent)
        setStudent(matchedStudent)
        setLoading(false)
    }

    useEffect(() => {
        getStudent();
    }, [])

    const [checkDelete, setCheckDelete] = useState<boolean>(false);
    const handleDeleteStudent = async () => {
        if (!checkDelete) return setCheckDelete(true);
        const apiResponse = await fetch('/api/students/deleteStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentId: studentId })
        });
        router.push("/dashboard/students");
    }

    if (loading || !student) return (
        <div className="absolute w-full top-0 left-0 w-full min-h-screen flex flex-col justify-center items-center">
            <Spinner />
        </div>
    )

    return (
        <>
            <div className="p-6">
                <div className="pb-6 flex items-center justify-start">
                    <Button onClick={() => router.push("/dashboard/students")} className="">
                        <ArrowLeftCircleIcon className="w-4 h-4 mr-1" />Back to Students
                    </Button>
                    <h2 className="text-2xl font-bold pl-6">{student.name}</h2>
                </div>
                <div className="grid w-full gap-6 grid-cols-1 md:grid-cols-10">

                    {/* Test & Test Controls */}
                    <div className="md:col-span-4">
                        <Card className="mb-6 p-2 rounded-lg border shadow-md flex flex-col items-center">
                            <CardHeader className="w-full p-2">
                                <div className="w-full flex items-center justify-between">
                                    <CardTitle>Information</CardTitle>
                                    {/* <Button size="sm" className="max-w-sm" variant={checkDelete ? "destructive" : "outline"} onClick={() => handleDeleteStudent()}>
                                        {checkDelete ? "Are you sure?" : "Delete Student"} <Trash className="w-4 h-4 ml-2" />
                                    </Button> */}
                                </div>
                            </CardHeader>
                            <div className="w-full p-2 space-y-1">
                                <div><span className="font-bold">Student ID: </span>{student.studentId}</div>
                                <div><span className="font-bold">Name: </span>{student.name}</div>
                                <div><span className="font-bold">Email: </span>{student.email}</div>
                                <div><span className="font-bold">Class: </span>{student.class}</div>
                            </div>
                        </Card>
                        <Card className="p-6 rounded-lg border shadow-md flex flex-col items-center">
                            <CardHeader className="w-full text-start p-0 pb-6">
                                <div className="w-full flex items-center justify-between">
                                    <CardTitle>Metrics</CardTitle>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className={`max-w-sm text-sm font-bold 
                                            ${calculateAverage(student.responses.map((response) => calculateAverage(response.responseGrades) / 10)) > 80 ?
                                                "border-green-400 text-green-400 hover:text-green-400 hover:bg-background cursor-default"
                                                : "border-orange-400 text-orange-400 hover:text-orange-400 hover:bg-background cursor-default"}
                                        `}
                                    >
                                        Average Grade: {calculateAverage(student.responses.map((response) => calculateAverage(response.responseGrades) / 10))}{`%`}
                                    </Button>
                                </div>
                            </CardHeader>
                            <BarGraph
                                data={student.responses.map((response, index) => {
                                    return ({
                                        gradeNum: calculateAverage(response.responseGrades),
                                        gradeStr: `${calculateAverage(response.responseGrades)}%`
                                    })
                                })}
                            />
                        </Card>
                    </div>

                    <div className="md:col-span-6">

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>Responses</CardTitle>
                                {/* <CardDescription>
                                    See information and metrics about each response
                                </CardDescription> */}
                            </CardHeader>
                            <CardContent className="">
                                <Accordion type="single" collapsible className="w-full text-xs">
                                    {student.responses.length === 0 ? (<div className="italic text-gray-500">No responses yet...</div>) : <></>}
                                    {student.responses.map((response, index) =>
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            {response.responseGrades.length > 0 ? (
                                                <AccordionTrigger>
                                                    <div className="flex flex-wrap w-full pr-2">
                                                        <div className="border rounded-lg p-2 mr-2 mb-2">
                                                            Test Name: <span className="font-bold">{response.test.testName}</span>
                                                        </div>
                                                        <div className="border rounded-lg p-2 mr-2 mb-2">
                                                            Class: <span className="font-bold">{student.class}</span>
                                                        </div>
                                                        <div className={`border rounded-lg p-2 mr-2 mb-2 
                                                            ${calculateAverage(response.responseGrades) <= 70.0 ? "border-red-400 text-red-400"
                                                                : calculateAverage(response.responseGrades) <= 80 ? "border-orange-400 text-orange-400"
                                                                    : "border-green-400 text-green-400"}`}
                                                        >
                                                            Grade: <span className={`font-bold`}>{calculateAverage(response.responseGrades)}%</span>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                            ) : (
                                                <div className="flex flex-wrap w-full pt-2">
                                                    <div className="border rounded-lg p-2 mr-2 mb-2">
                                                        Test Name: <span className="font-bold">{response.test.testName}</span>
                                                    </div>
                                                    <div className="border rounded-lg p-2 mr-2 mb-2">
                                                        Class: <span className="font-bold">{student.class}</span>
                                                    </div>
                                                    <a onClick={() => router.push(`/dashboard/tests/grade-test/${response.testId}?studentId=${studentId}`)} className="flex items-center border border-primary text-primary hover:bg-primary/20 font-bold underline rounded-lg p-2 mr-2 mb-2 cursor-pointer">
                                                        Grade
                                                        <PenBoxIcon className="ml-1 w-4 h-4" />
                                                    </a>
                                                </div>
                                            )}

                                            <AccordionContent>
                                                <div className="w-full md:pr-20">
                                                    {response.questionResponses.map((studentAnswer, index) =>
                                                        <div key={index} className="border rounded-lg p-2 mb-4">
                                                            <div className="font-bold text-xs underline mb-2">Response to Question {index + 1}: </div>
                                                            <div className="text-xs mb-2">{studentAnswer}</div>
                                                            <div className="text-xs">
                                                                <span className="font-bold">Feedback:</span> {response.responseFeedbacks[index]}
                                                            </div>
                                                            <div className="text-xs">
                                                                <span className="font-bold">Grade:</span> {response.responseGrades[index]}{"/10"}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <Button onClick={() => router.push(`/dashboard/tests/grade-test/${response.testId}?index=${index}`)} variant="outline" size="sm" className="text-xs border-primary text-primary">
                                                        Edit Grade <PenBoxIcon className="ml-1 w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )}
                                </Accordion>
                            </CardContent>
                        </Card>

                    </div>

                </div>
            </div >
        </>
    )
}