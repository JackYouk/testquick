"use client"

import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LineGraph } from "@/components/graphs/line-graph";
import { ArrowBigLeftIcon, ArrowLeftCircleIcon, CameraIcon, DownloadIcon, Link2Icon, LinkIcon, PenBoxIcon, Pencil, Trash } from "lucide-react";
import { EyeClosedIcon, LinkBreak1Icon, LinkBreak2Icon, LockClosedIcon, LockOpen1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Question, Response, Test } from "@/app/types/test";
import { Spinner } from "@/components/ui/spinner";
import { calculateAverage, getURL, handleDownloadAsPdf } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";


export default function TestPage({ params }: { params: { testId: string } }) {
    const router = useRouter();
    const testId = params.testId;

    const [loading, setLoading] = useState<boolean>(false);
    const [test, setTest] = useState<Test>();
    const [testMetrics, setTestMetrics] = useState<{ average: number; top: number; low: number; }[]>();

    const getTest = async () => {
        setLoading(true);
        const response = await fetch(`/api/tests/${testId}`)
        const matchedTest = await response.json() as Test & { questions: Question[], responses: Response[] }
        setTest(matchedTest);
        console.log(matchedTest)
        const calculatedMetrics = calculateTestMetrics(matchedTest).testMetrics;
        setTestMetrics(calculatedMetrics);
        setLoading(false);
    }

    useEffect(() => {
        getTest();
    }, []);


    // const test = exampleTest;
    function calculateTestMetrics(test: Test): { testMetrics: { average: number; top: number; low: number; }[], averageTotalScore: number } {
        if (!test) {
            return {
                testMetrics: [],
                averageTotalScore: 0
            };
        }
        const numberOfQuestions = test.questions.length;
        let questionStatistics = Array.from({ length: numberOfQuestions }, () => ({ average: 0, top: -Infinity, low: Infinity, count: 0 }));

        // Process each response
        test.responses.forEach((response: Response) => {
            response.responseGrades.forEach((grade, index) => {
                if (grade !== null) { // Check if score is not null
                    // Aggregate scores for average calculation
                    questionStatistics[index].average += grade;
                    questionStatistics[index].count += 1;
                    // Determine the top score
                    questionStatistics[index].top = Math.max(questionStatistics[index].top, grade);
                    // Determine the low score
                    questionStatistics[index].low = Math.min(questionStatistics[index].low, grade);
                }
            });
        });

        // Finalize the average scores for each question
        questionStatistics.forEach(stat => {
            if (stat.count !== 0) { // Ensure we do not divide by zero
                stat.average = parseFloat((stat.average / stat.count).toFixed(2));
            } else {
                stat.average = 0; // If no scores, set average to 0
                stat.low = 0; // If no scores, set low to 0
            }
        });

        // Calculate the average of all total scores, considering only the graded responses
        const gradedResponses = test.responses.filter((response, index) => response.responseGrades[index] !== null);
        let averageTotalScore = gradedResponses.length > 0 // Check if there are graded responses
            ? parseFloat((gradedResponses.reduce((acc, curr, index) => acc + (curr.responseGrades[index] || 0), 0) / gradedResponses.length).toFixed(2))
            : 0; // If no graded responses, average total score is 0

        // Return the result without the count property
        return {
            testMetrics: questionStatistics.map(({ average, top, low }) => ({ average, top, low })),
            averageTotalScore: averageTotalScore
        };
    }

    const [checkDelete, setCheckDelete] = useState<boolean>(false);
    const [displayLink, setDisplayLink] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const handleDownload = async () => {
        if (!test) return
        handleDownloadAsPdf(test);
    }

    const handleShowLink = async () => {
        setDisplayLink(true);
    }

    const handleDeleteTest = async () => {
        if (!checkDelete) return setCheckDelete(true);
        const apiResponse = await fetch('/api/tests/deleteTest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ testId: testId })
        });
        router.push("/dashboard/tests");
    }

    const handleLockSubmissions = async (status: string) => {
        // TODO: set status to locked
        console.log(status)
        let newStatus = "";
        if (status === "open") {
            newStatus = "closed"
        } else {
            newStatus = "open"
        }

        const response = await fetch('/api/tests/changeStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ testId: testId, newStatus })
        });
        const { updatedTest } = await response.json();
        await getTest();
    }


    if (loading || !test || !testMetrics) return (
        <div className="absolute w-full top-0 left-0 w-full min-h-screen flex flex-col justify-center items-center">
            <Spinner />
        </div>
    )

    return (
        <>
            <div className="p-6">
                <div className="pb-6 flex items-center justify-start">
                    <Button onClick={() => router.push("/dashboard/tests")} className="">
                        <ArrowLeftCircleIcon className="w-4 h-4 mr-1" />Back to Tests
                    </Button>
                    <h2 className="text-2xl font-bold pl-6">{test.testName}</h2>
                </div>
                <div className="grid w-full gap-6 grid-cols-1 md:grid-cols-10">

                    {/* Test & Test Controls */}
                    <div className="md:col-span-4">
                        <Card className="mb-6 p-2 rounded-lg border shadow-md flex flex-col md:flex-row md:flex-wrap justify-start md:items-center">
                            <CardHeader className="w-full text-start p-2">
                                <CardTitle>Actions</CardTitle>
                                {/* <CardDescription>
                                    Take action on your test.
                                </CardDescription> */}
                            </CardHeader>
                            <Button className="m-2" variant="outline" onClick={() => router.push(`/dashboard/tests/build-test/${testId}`)}>
                                Edit Questions <Pencil className="w-4 h-4 ml-2" />
                            </Button>

                            <Button className="m-2" variant="outline" onClick={() => handleDownload()}>
                                Download Test as PDF <DownloadIcon className="w-4 h-4 ml-2" />
                            </Button>
                            <Button className="m-2" variant="outline" onClick={() => handleShowLink()}>
                                Display Testing Link <LinkIcon className="w-4 h-4 ml-2" />
                            </Button>
                            <Button className="m-2" variant="outline" onClick={() => handleLockSubmissions(test.status)}>
                                {test.status === "open" ? (
                                    <>Lock Submissions <LockClosedIcon className="w-4 h-4 ml-2" /></>
                                ) : (
                                    <>Unlock Submissions <LockOpen1Icon className="w-4 h-4 ml-2" /></>
                                )}
                            </Button>
                            <Button className="m-2" variant={checkDelete ? "destructive" : "outline"} onClick={() => handleDeleteTest()}>
                                {checkDelete ? "Are you sure?" : "Delete Test"} <Trash className="w-4 h-4 ml-2" />
                            </Button>
                            <Button className="m-2 hidden md:flex" variant="outline" onClick={() => { }}>
                                Upload Response as Picture <CameraIcon className="w-4 h-4 mx-2" /> <Badge className="text-xs" variant="secondary">Coming Soon</Badge>
                            </Button>
                        </Card>
                        <Card className="p-6 rounded-lg border shadow-md flex flex-col items-center">
                            <CardHeader className="w-full text-start p-0 pb-6">
                                <CardTitle>Questions</CardTitle>
                                {/* <CardDescription>
                                    These are the questions on the quiz.
                                </CardDescription> */}
                            </CardHeader>
                            {test.questions.map((question, index) => (
                                <div key={index} className="grid w-full items-center gap-1.5 mb-4">
                                    <div className="">
                                        <span className="font-bold">{index + 1}. </span>
                                        <span dangerouslySetInnerHTML={{ __html: question.questionText.replace(/\n/g, '<br>') }} />
                                    </div>
                                </div>
                            ))}
                        </Card>
                    </div>

                    <div className="md:col-span-6">
                        <LineGraph data={testMetrics} />
                        <Card className="mt-6 shadow-md">
                            <CardHeader>
                                <CardTitle>Responses</CardTitle>
                                <CardDescription>
                                    See information and metrics about each response
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="">
                                <Accordion type="single" collapsible className="w-full text-xs">
                                    {test.responses.length === 0 ? (<div className="italic text-gray-500">No responses yet...</div>) : <></>}
                                    {test.responses.map((response, index) =>
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            {response.responseGrades.length > 0 ? (
                                                <AccordionTrigger>
                                                    <div className="flex flex-wrap w-full pr-2">
                                                        <div className="border rounded-lg p-2 mr-2 mb-2">
                                                            Student: <span className="font-bold">{response.student.studentId}</span> {response.student.name}
                                                        </div>
                                                        <div className="border rounded-lg p-2 mr-2 mb-2">
                                                            Class: <span className="font-bold">{response.student.class}</span>
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
                                                        Student: <span className="font-bold">{response.student.studentId}</span> {response.student.name}
                                                    </div>
                                                    <div className="border rounded-lg p-2 mr-2 mb-2">
                                                        Class: <span className="font-bold">{response.student.class}</span>
                                                    </div>
                                                    <a onClick={() => router.push(`/dashboard/tests/grade-test/${testId}?studentId=${response.studentId}`)} className="flex items-center border border-primary text-primary hover:bg-primary/20 font-bold underline rounded-lg p-2 mr-2 mb-2 cursor-pointer">
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
                                                    <Button onClick={() => router.push(`/dashboard/tests/grade-test/${testId}?studentId=${response.studentId}`)} variant="outline" size="sm" className="text-xs border-primary text-primary">
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

            {displayLink ? (
                <div className="fixed top-0 z-20 h-screen w-full bg-muted-foreground/60 flex items-center justify-center" onClick={() => setDisplayLink(false)}>
                    <Card className="hover:text-primary cursor-pointer" onClick={e => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(`${getURL()}testing/${testId}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 3000)
                    }}>
                        <CardHeader>
                            <div className="pb-2 text-gray-500 text-center text-xl font-bold">
                                {copied ? 'Copied!' : 'Click to Copy!'}
                            </div>
                            <CardTitle className="hover:underline break-words w-72 md:w-full">
                                {`${getURL()}testing/${testId}`}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            ) : <></>}
        </>
    )
}