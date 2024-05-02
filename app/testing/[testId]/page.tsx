"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { StudentForm } from "./student-form"
import { Logo } from "@/components/logo"
import { Question, Student, Test } from "@/app/types/test"
import { LockClosedIcon } from "@radix-ui/react-icons"
import { Response } from "@/app/types/test"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { TextIcon, TextAlignJustifyIcon, FontSizeIcon } from "@radix-ui/react-icons"
import { FontSizeToggle } from "./student-helpers/fontsize-toggle"
import TestComponent from "./testing-component"
import { GridToggle } from "./student-helpers/grid-toggle"
import { CalculatorHelper } from "./student-helpers/calculator"
import { LogOutIcon } from "lucide-react"
import { AiHintsHelper } from "./student-helpers/ai-hints"

export default function Testing({ params }: { params: { testId: string } }) {
    const testId = params.testId;

    const [student, setStudent] = useState<Student>();
    const [studentFormAnswered, setStudentFormAnswered] = useState<boolean>(false);
    const [testCompleted, setTestCompleted] = useState<boolean>(false);

    const [test, setTest] = useState<Test>();
    const [responses, setResponses] = useState<string[]>([]);
    const [feedbacks, setFeedbacks] = useState<string[]>([]);
    const [grades, setGrades] = useState<string[]>([]);

    const getTest = async () => {
        try {
            const response = await fetch(`/api/tests/sanitized/${testId}`);
            if (!response.ok) {
                throw new Error(`Error fetching test: ${response.statusText}`);
            }
            const fetchedTest = await response.json();
            setTest(fetchedTest);
            const savedStudentData = localStorage.getItem('studentData');
            if (savedStudentData) {
                setStudent(JSON.parse(savedStudentData));
                setStudentFormAnswered(true);
            }
            const savedTestCompleted = localStorage.getItem(`completed-${testId}`);
            if (savedTestCompleted) {
                setTestCompleted(true)
            }
            const savedResponses = localStorage.getItem(`responses-${testId}`);
            if (!savedResponses) {
                setResponses(Array(fetchedTest.questions.length).fill(''));
            } else {
                setResponses(JSON.parse(savedResponses));
            }

            const savedFeedbacks = localStorage.getItem(`feedbacks-${testId}`);
            if (savedFeedbacks !== null && savedFeedbacks.length > 0) {
                setFeedbacks(JSON.parse(savedFeedbacks));
            }
            const savedGrades = localStorage.getItem(`grades-${testId}`);
            if (savedGrades !== null && savedGrades.length > 0) {
                setGrades(JSON.parse(savedGrades));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getTest();
    }, []);

    useEffect(() => {
        const savedResponses = localStorage.getItem(`responses-${testId}`);
        if (!savedResponses) {
            setResponses(Array(test?.questions.length).fill(''));
        } else {
            setResponses(JSON.parse(savedResponses));
        }
        const savedFeedbacks = localStorage.getItem(`feedbacks-${testId}`);
        if (savedFeedbacks !== null && savedFeedbacks.length > 0) {
            setFeedbacks(JSON.parse(savedFeedbacks));
        } else {
            setFeedbacks([])
        }
        const savedGrades = localStorage.getItem(`grades-${testId}`);
        if (savedGrades !== null && savedGrades.length > 0) {
            setGrades(JSON.parse(savedGrades));
        } else {
            setGrades([])
        }
    }, [testCompleted])


    const handleResponseChange = (value: string, index: number) => {
        const newResponses = responses.map((response, i) => (i === index ? value : response));
        setResponses(newResponses);
        localStorage.setItem(`responses-${testId}`, JSON.stringify(newResponses));
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const allResponsesFilled = (): boolean => {
        return responses.every(question => question.trim() !== "");
    };

    const submitQuestions = async () => {
        if (!test) return;
        if (!student) {
            setStudentFormAnswered(false);
            return;
        }
        if (!allResponsesFilled()) {
            setErrorMsg("All responses must have an answer.");
            setError(true);
            setTimeout(() => setError(false), 2500);
            return;
        }
        setLoading(true);
        try {
            const studentResponse = {
                studentId: student.id,
                testId: test.id,
                questionResponses: responses,
            }
            const apiResponse = await fetch('/api/tests/newResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentResponse)
            });
            if (!apiResponse.ok) {
                throw new Error(`Error fetching test: ${apiResponse.statusText}`);
            }
            setTestCompleted(true);
            localStorage.setItem(`completed-${testId}`, "true");
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (error) {
            console.error(error);
            setErrorMsg("An error occurred while submitting your responses. Please try again.");
            setError(true);
            setTimeout(() => setError(false), 3500);
        } finally {
            setLoading(false);
        }
    }

    if (!test) {
        return (
            <>
                <div className="w-full h-screen flex flex-col justify-center items-center">
                    <Logo className="text-[25px] md:text-[50px]" />
                    <svg aria-hidden="true" className="mt-4 w-10 h-10 text-gray-500/40 animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </div>
            </>
        )
    }

    if (test.status === "closed") {
        return (
            <>
                <div className="w-full h-screen flex flex-col justify-center items-center text-gray-500">
                    <LockClosedIcon className="w-32 h-32" />
                    <div className="font-bold text-lg">{test.testName} is Locked</div>
                </div>
            </>
        )
    }

    if (!studentFormAnswered) {
        return (
            <div className="container min-h-screen flex flex-col w-full justify-center items-center p-6 md:px-20">
                <div className="w-full md:w-2/3 border bg-background rounded-lg p-6">
                    <div className="text-primary font-bold text-center text-xl underline opacity-90 mb-1">
                        {test.testName}
                    </div>
                    <StudentForm
                        setStudent={setStudent}
                        setFormAnswered={setStudentFormAnswered}
                        teacherEmail={test.owner}
                        courseName={test.courseName}
                        testId={test.id}
                        setTestCompleted={setTestCompleted}
                    />
                </div>
            </div>
        )
    }

    if (testCompleted) {
        return (
            <>
                <div className="w-full min-h-screen flex flex-col justify-center items-center p-6">
                    <div className="relative p-6 md:w-2/3 rounded-lg border bg-background shadow-md flex flex-col items-center">
                        <Button size="icon" variant="outline" className="absolute top-6 right-6" onClick={() => {
                            localStorage.removeItem(`studentData`);
                            localStorage.removeItem(`responses-${testId}`);
                            localStorage.removeItem(`grades-${testId}`);
                            localStorage.removeItem(`feedbacks-${testId}`);
                            localStorage.removeItem(`completed-${testId}`);
                            setTestCompleted(false);
                            setStudentFormAnswered(false);
                        }}>
                            <LogOutIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                            <span className="sr-only">Log out button</span>
                        </Button>
                        <div className="text-primary text-2xl font-bold">Submitted!</div>
                        <div className="text-gray-500 text-md font-bold text-center">You will be emailed results once your response is graded.</div>
                        <div className="mt-8 w-full">
                            {test.questions.map((question: Question, index: number) => (
                                <div key={'response' + index} className="grid w-full items-center gap-1.5 mb-4 border border-primary border-dashed p-2 rounded">
                                    <Label htmlFor={`question-${index}`} className="text-primary font-bold">Question {index + 1}</Label>
                                    <div className="text-xs font-bold" dangerouslySetInnerHTML={{ __html: question.questionText.replace(/\n/g, '<br>') }} />
                                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: responses[index].replace(/\n/g, '<br>') }} />
                                    {feedbacks[index] ? <div className="font-bold text-xs">
                                        Feedback: <span className="font-normal" dangerouslySetInnerHTML={{ __html: feedbacks[index].replace(/\n/g, '<br>') }} />
                                    </div> : <></>}
                                    {grades[index] ? <div className="font-bold text-xs">
                                        Grade: <span className="font-normal">{grades[index]}/10</span>
                                    </div> : <></>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="container min-h-screen w-full p-6 md:px-20">
                <div className="grid gap-6 md:gap-10 grid-cols-1 md:grid-cols-10 w-full">
                    {/* Questions editor */}
                    <div className="md:col-span-7 p-6 rounded-lg border bg-background shadow-md flex flex-col items-center">
                        <div className="text-primary font-bold text-center text-xl underline opacity-90 mb-1">
                            {test.testName}
                        </div>
                        <div className="text-gray-500 text-center text-xs md:w-5/6 mb-4">
                            <span className="font-bold">{' '}There are no &quot;right&quot; answers to any of the questions- </span>
                            answer to the best of your ability and in your own words.
                        </div>
                        <TestComponent
                            test={test}
                            responses={responses}
                            handleResponseChange={handleResponseChange}
                            submitQuestions={submitQuestions}
                            error={error}
                            errorMsg={errorMsg}
                            loading={loading}
                        />
                    </div>

                    <div className="md:col-span-3">
                        {/* Student info */}
                        <div className="relative p-6 rounded-lg border bg-background shadow-md flex flex-col items-center w-full text-wrap truncate">
                            <Button size="icon" variant="outline" className="absolute top-6 right-6" onClick={() => {
                                localStorage.removeItem(`studentData`);
                                localStorage.removeItem(`responses-${testId}`);
                                localStorage.removeItem(`grades-${testId}`);
                                localStorage.removeItem(`feedbacks-${testId}`);
                                localStorage.removeItem(`completed-${testId}`);
                                setTestCompleted(false);
                                setStudentFormAnswered(false);
                            }}>
                                <LogOutIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                                <span className="sr-only">Log out button</span>
                            </Button>
                            <div className="grid w-full items-center gap-1.5">
                                <div className="text-primary font-bold underline">Student Information</div>
                                <div className="text-sm text-gray-500 ">Student ID: <span className="font-bold">{student?.studentId}</span></div>
                                <div className="text-sm text-gray-500">Name: <span className="font-bold">{student?.name}</span></div>
                                <div className="text-sm text-gray-500">Email: <span className="font-bold">{student?.email}</span></div>
                                <div className="text-sm text-gray-500">Class: <span className="font-bold">{student?.class}</span></div>
                            </div>
                        </div>
                        {/* Interface settings */}
                        <div className="mt-6 md:mt-10 p-6 rounded-lg border bg-background shadow-md flex flex-col items-center w-full">
                            <div className="grid w-full items-center gap-1.5 mb-4">
                                <div className="text-primary font-bold underline">Settings & Helpers</div>
                            </div>
                            <div className="w-full grid grid-cols-5">
                                <ThemeToggle className="" />
                                <GridToggle className="" />
                                <FontSizeToggle className="" />
                                <CalculatorHelper className="" />
                                <AiHintsHelper
                                    questions={test.questions}
                                    responses={responses}
                                    threadId={test.threadId}
                                    className=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}