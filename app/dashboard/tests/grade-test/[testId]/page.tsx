"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Question, Response, Test } from "@/app/types/test";
import { Logo } from "@/components/logo";
import { Spinner } from "@/components/ui/spinner";


export default function GradeTest({ params }: { params: { testId: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const studentResponseId = searchParams.get('studentId')
    const testId = params.testId;

    const [test, setTest] = useState<Test>();
    const [studentResponse, setStudentResponse] = useState<Response>();
    const [totalScore, setTotalScore] = useState<number>(0.0);

    const getTest = async () => {
        const response = await fetch(`/api/tests/${testId}`)
        const fetchedTest = await response.json();
        setTest(fetchedTest);
        const response2 = await fetch(`/api/tests/getResponseByStudent/${testId}?studentId=${studentResponseId}`)
        const fetchedStudentResponse = await response2.json();
        setStudentResponse(fetchedStudentResponse.studentResponse)
        const responseGrades = fetchedStudentResponse.studentResponse.responseGrades
        if (responseGrades) {
            const total = responseGrades.reduce((acc: number, grade: number) => acc + grade, 0);
            const averageScore = total / responseGrades.length * 10;
            setTotalScore(averageScore);
        }
    }

    useEffect(() => {
        getTest();
    }, []);


    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [autoGradeLoading, setAutoGradeLoading] = useState<boolean>(false);
    const [autoGradeError, setAutoGradeError] = useState<boolean>(false);


    const handleScoreChange = (index: number, value: string) => {
        if (!test || !studentResponse) return;

        // Parse the score as a float; if it's not a valid number, default to 0
        const score = parseFloat(value) || 0;
        const newGrades = studentResponse.responseGrades && Array.isArray(studentResponse.responseGrades)
            ? [...studentResponse.responseGrades]
            : new Array(test.questions.length).fill(0);

        // Update the grade at the specific index
        newGrades[index] = score;
        setStudentResponse({ ...studentResponse, responseGrades: newGrades });

        // Calculate the new average score
        const total = newGrades.reduce((acc, grade) => acc + grade, 0);
        const averageScore = total / test.questions.length;
        const percentageScore = (averageScore / 10) * 100; // Assumes 10 is the max score per question

        // Set the total score with two decimal places if needed
        setTotalScore(parseFloat(percentageScore.toFixed(2)));
        setError(false);
    };

    const handleFeedbackChange = (index: number, value: string) => {
        if (!test || !studentResponse) return;

        const newFeedbacks = studentResponse.questionResponses.map((_, idx) =>
            studentResponse.responseFeedbacks && studentResponse.responseFeedbacks[idx] != null
                ? studentResponse.responseFeedbacks[idx]
                : ""
        );

        newFeedbacks[index] = value;
        setStudentResponse({ ...studentResponse, responseFeedbacks: newFeedbacks });
    };

    const autoGrade = async () => {
        try {
            if (!test || !studentResponse) return;
            setAutoGradeLoading(true);

            let questionResponsesString = "";
            studentResponse.questionResponses.map((qResponse: string, index: number) =>
                questionResponsesString += `Q${index + 1}: ${qResponse} \n\n\n`);

            let testQuestionsString = "";
            test.questions.map((question: Question, index: number) =>
                testQuestionsString += `Q${index + 1}: ${question.questionText} \n\n\n`);

            const apiResponse = await fetch('/api/tests/autoGrade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    testQuestionsString,
                    questionResponsesString,
                    numQuestions: test.questions.length,
                    threadId: test.threadId,
                    testId,
                })
            });
            const { feedbackSuggestions, gradeSuggestions } = await apiResponse.json();
            if (!feedbackSuggestions || !gradeSuggestions || !(feedbackSuggestions.length > 0) || !(gradeSuggestions.length > 0)) {
                throw new Error("Auto-grading failed to provide suggestions or grades.");
            }
            setStudentResponse({ ...studentResponse, responseGrades: gradeSuggestions, responseFeedbacks: feedbackSuggestions });
            // Calculate the new average score
            const total = gradeSuggestions.reduce((acc: number, grade: number) => acc + grade, 0);
            const averageScore = total / test.questions.length;
            const percentageScore = (averageScore / 10) * 100;
            setTotalScore(parseFloat(percentageScore.toFixed(2)));
            setAutoGradeLoading(false);
        } catch (err) {
            console.error(err);
            setAutoGradeLoading(false);
            setAutoGradeError(true);
            setTimeout(() => {
                setAutoGradeError(false);
            }, 2000)
        }
    };


    const allGradesFilled = (): boolean => {
        if (!test || !studentResponse) return false;
        return studentResponse.responseGrades.length === test.questions.length;
    };

    const submit = async () => {
        try {
            if (!allGradesFilled()) {
                setErrorMsg("All questions must have a grade");
                setError(true);
                return;
            }
            setLoading(true);
            const apiResponse = await fetch('/api/tests/updateResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentResponse)
            });
            const { status } = await apiResponse.json();
            if (status != 200) {
                throw new Error("Error submitting response");
            }
            await fetch('/api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recepientEmail: studentResponse?.student.email,
                    message: `<h2>Grade Report</h2>
                    <p>Your teacher has graded your response to <strong>${test?.testName}</strong></p>
                    <p>Your grade: <strong>${totalScore}%</strong></p>
                    ${studentResponse?.questionResponses.map((qResponse, index) => `
                      <div class="question">
                        <strong>${test?.questions[index].questionText.replace(/\n/g, '<br>')}</strong>
                        <p>Response: ${qResponse}</p>
                        <p>Grade: ${studentResponse.responseGrades[index]}/10</p>
                        <p>Feedback: ${studentResponse.responseFeedbacks[index] ?? "n/a"}</p>
                      </div>
                    `).join("")}`,
                })
            });
            setLoading(false);
            router.push(`/dashboard/tests/view/${testId}`);
        } catch (err) {
            console.error(err);
            setLoading(false);
            setErrorMsg("An error occurred during submission.");
            setError(true);
            setTimeout(() => {
                setErrorMsg("");
                setError(false);
            }, 2000)
        }
    };


    if (!test || !studentResponse) {
        return (
            <>
                <div className="w-full h-screen flex flex-col justify-center items-center">
                    <Logo className="text-[25px] md:text-[50px]" />
                    <Spinner />
                </div>
            </>
        )
    }

    return (
        <>
            <div className="container min-h-screen w-full p-6 md:px-20">

                <div className="grid gap-6 md:gap-10 grid-cols-1 md:grid-cols-10 w-full">
                    {/* Questions editor */}
                    <div className="md:col-span-7 p-6 space-y-4 rounded-lg border bg-background shadow-md flex flex-col items-center">
                        <div className="text-primary font-bold text-center text-xl underline opacity-90 mb-1">
                            {test.testName}
                        </div>
                        <div className="w-full">
                            {test.questions.map((question, index) => (
                                <div key={index} className="grid w-full items-center gap-1.5 mb-8">
                                    <div className="text-primary underline font-bold">
                                        Question {index + 1}
                                    </div>
                                    <Label htmlFor={`question-${index}`} className="text-primary leading-4" dangerouslySetInnerHTML={{ __html: question.questionText.replace(/\n/g, '<br>') }} />
                                    <div dangerouslySetInnerHTML={{ __html: studentResponse.questionResponses[index].replace(/\n/g, '<br>') }} />

                                    <Label htmlFor={`question-${index}`} className="text-primary mt-2 text-gray-500">Score</Label>
                                    <div className="flex text-sm font-bold items-center">
                                        <Input
                                            placeholder=""
                                            className="max-w-[50px] mr-2 p-1 text-center"
                                            type="number"
                                            max={10}
                                            min={0}
                                            value={studentResponse.responseGrades[index] ?? ""}
                                            onChange={(e) => handleScoreChange(index, e.target.value)}
                                        />/10
                                    </div>

                                    <Label htmlFor={`question-${index}`} className="text-primary text-gray-500 mt-1">Feedback</Label>
                                    <Textarea
                                        placeholder=""
                                        className=""
                                        value={studentResponse.responseFeedbacks[index] ?? ""}
                                        onChange={(e) => handleFeedbackChange(index, e.target.value)}
                                    />

                                </div>
                            ))}
                            <Button
                                onClick={() => submit()}
                                variant="default"
                                className="w-full mt-4"
                                disabled={loading || error || autoGradeLoading}
                            >
                                {loading ? (
                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-300 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                ) : autoGradeLoading ? 'Waiting for Auto-Grader to finish...' : error ? errorMsg : 'Save & Submit'}
                            </Button>
                        </div>
                    </div>

                    {!loading && test.questions.length > 0 ? (
                        <div className="md:col-span-3">
                            <div className="mb-6 p-6 rounded-lg border bg-background shadow-md flex flex-col items-center w-full">
                                <div className="grid w-full items-center gap-1.5">
                                    <div className="text-primary font-bold underline">
                                        Student Information
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        Student ID: {studentResponse.student.studentId}
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        Name: {studentResponse.student.name}
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        Email: {studentResponse.student.email}
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        Class: {studentResponse.student.class}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 mb-6 rounded-lg border bg-background shadow-md flex flex-col items-center w-full">
                                <div className="grid w-full items-center gap-1.5">
                                    <div className="text-primary font-bold underline">Auto-Grader</div>
                                    <div className="text-xs text-gray-500 font-bold">Generate suggested scores and feedback</div>
                                </div>
                                <Button
                                    onClick={() => autoGrade()}
                                    variant={autoGradeError ? "destructive" : "outline"}
                                    size="sm"
                                    className="w-full mt-4"
                                    disabled={autoGradeLoading || autoGradeError}
                                >
                                    {autoGradeLoading ? (
                                        <svg aria-hidden="true" className="w-6 h-6 text-gray-300 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                    ) : autoGradeError ? ' Auto-Grader Error' : 'Auto-Grade'}
                                </Button>
                            </div>
                            {!Number.isNaN(totalScore) ? (
                                <div className="fixed bottom-6 p-6 rounded-lg border bg-background shadow-md flex flex-col items-center">
                                    <div className="grid w-full items-center gap-1.5">
                                        <div className="text-primary font-bold underline">
                                            Total Score
                                        </div>
                                        <div className="mt-4 text-center font-bold text-zinc-600 dark:text-zinc-400">
                                            <span
                                                className={`mr-1 text-4xl font-bold ${totalScore >= 80.0 ? "text-green-400" : totalScore >= 70.0 ? "text-orange-400" : "text-red-400"}`}
                                            >
                                                {totalScore}
                                            </span>%
                                        </div>
                                    </div>
                                </div>
                            ) : <></>}
                        </div>
                    ) : (
                        <></>
                    )}

                </div>
            </div>
        </>
    )
}