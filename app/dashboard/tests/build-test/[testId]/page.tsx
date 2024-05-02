"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Test, Question } from '@prisma/client'
import { Trash2Icon, TrashIcon } from "lucide-react"

export default function BuildTest({ params }: { params: { testId: string } }) {
    const testId = params.testId;
    const router = useRouter();

    const [questions, setQuestions] = useState<string[]>([]);
    const [testName, setTestName] = useState<string>('');

    const getTest = async () => {
        const response = await fetch(`/api/tests/${testId}`)
        const test = await response.json() as Test & { questions: Question[] }

        setTestName(test.testName);
        setQuestions(test.questions.map((question) => question.questionText));
    }

    useEffect(() => {
        getTest();
    }, []);

    const handleQuestionChange = (newQuestion: string, index: number) => {
        setError(false);
        const updatedQuestions = [...questions];
        updatedQuestions[index] = newQuestion;
        setQuestions(updatedQuestions);
    };

    const handleDeleteQuestion = (index: number) => {
        setError(false);
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1)
        setQuestions(updatedQuestions);
    }

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const allQuestionsFilled = (): boolean => {
        return questions.every(question => question.trim() !== "");
    };

    const submitQuestions = async () => {
        if (!allQuestionsFilled()) {
            setErrorMsg("All questions must have a value");
            setError(true);
            return
        }
        setLoading(true);
        // TODO: update questions/test
        const response = await fetch('/api/tests/updateTest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ testId: testId, newQuestions: questions })
        });
        const { updatedTest } = await response.json();
        setLoading(false);
        if (!updatedTest) {
            setErrorMsg("Error saving test");
            setError(true);
            return;
        }
        router.push(`/dashboard/tests/publish-test/${testId}`);
    }


    // Suggestions feature
    const [suggestion, setSuggestion] = useState<string>('');
    const [suggestionLoading, setSuggestionLoading] = useState<boolean>(false);
    const [suggestionError, setSuggestionError] = useState<boolean>(false);

    const submitSuggestion = async () => {
        if (suggestion.length === 0) {
            setSuggestionError(true);
            return;
        }
        setSuggestionLoading(true);
        console.log({ testId, suggestion, questions })
        try {
            const response = await fetch('/api/tests/suggestTest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ testId, suggestion, questions })
            });
            if (!response.ok) {
                throw new Error("Failed to submit suggestion due to server error");
            }
            const newSuggestedQuestions = await response.json();
            setSuggestionLoading(false);
            setQuestions(newSuggestedQuestions.questions);
            setSuggestion("");
        } catch (err) {
            console.error(err);
            setSuggestionLoading(false);
            setSuggestionError(true);
            setTimeout(() => setSuggestionError(false), 2000)
        }
    };


    return (
        <>
            <div className="container w-full p-6 md:px-20">
                {/* Logo */}
                {/* <div className="w-full flex items-center justify-center">
                    <Logo className="h-24" />
                </div> */}

                <div className="grid gap-6 md:gap-10 grid-cols-1 md:grid-cols-10 w-full">

                    {/* Questions editor */}
                    {questions.length > 0 ? (
                        <>
                            <div className="md:col-span-7 p-6 rounded-lg border bg-background shadow-md flex flex-col items-center">
                                <div className="text-primary font-bold text-center text-xl underline opacity-90 mb-1">
                                    {testName}
                                </div>
                                <div className="text-gray-500 text-center text-xs md:w-5/6 mb-4">
                                    This set of free response questions has been generated from your uploaded materials,
                                    you now have the opportunity to make editions.
                                </div>
                                <div className="w-full">
                                    {questions.length > 0 && questions.map((question, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="grid w-full items-center gap-1.5 mb-4">
                                                <Label htmlFor={`question-${index}`} className="text-primary">Question {index + 1}</Label>
                                                <Textarea
                                                    id={`question-${index}`}
                                                    placeholder="Type your question here."
                                                    value={question}
                                                    onChange={(e) => handleQuestionChange(e.target.value, index)}
                                                />
                                            </div>
                                            <Button size="icon" variant="ghost" className="ml-3" onClick={() => handleDeleteQuestion(index)}>
                                                <TrashIcon />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        onClick={() => submitQuestions()}
                                        variant="default"
                                        className="w-full mt-4"
                                        disabled={loading || error || suggestionLoading}
                                    >
                                        {loading ? (
                                            <svg aria-hidden="true" className="w-6 h-6 text-gray-300 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                        ) : suggestionLoading ? 'Waiting for suggestion to be implemented...' : error ? errorMsg : 'Save & Continue'}
                                    </Button>
                                </div>
                            </div>

                            {/* Suggestions Feature */}
                            <div className="md:col-span-3">
                                <div className="p-6 rounded-lg border bg-background shadow-md flex flex-col items-center w-full">
                                    <div className="grid w-full items-center gap-1.5">
                                        <div className="text-primary font-bold underline">Revise this test</div>
                                        <div className="text-xs text-gray-500 font-bold pb-1">Ask our ai to change this test in any way you please.</div>
                                        <Textarea
                                            id="Suggestion"
                                            className="h-full"
                                            placeholder={`Make this test easier...\nMake this test 2 questions shorter...`}
                                            value={suggestion}
                                            onChange={(e) => {
                                                setSuggestionError(false)
                                                setSuggestion(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <Button
                                        onClick={() => submitSuggestion()}
                                        variant={suggestionError ? "destructive" : "outline"}
                                        size="sm"
                                        className="w-full mt-4"
                                        disabled={suggestionLoading || suggestionError}
                                    >
                                        {suggestionLoading ? (
                                            <svg aria-hidden="true" className="w-6 h-6 text-gray-300 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                        ) : suggestionError ? 'Error revising test' : 'Revise test with suggestions'}
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute w-full top-0 left-0 w-full min-h-screen flex flex-col justify-center items-center">
                                <svg aria-hidden="true" className="mt-4 w-10 h-10 text-gray-300/40 animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </>
    )
}