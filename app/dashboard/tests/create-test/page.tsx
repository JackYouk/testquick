"use client";
import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FileUpload } from "./components/file-upload";
import { Textarea } from "@/components/ui/textarea";
import { TestRequest } from "@/app/types/test";
import GenLoadingPage from "./components/generation-loading";

export default function UploadMaterials() {
    const router = useRouter();

    const [testData, setTestData] = useState<Omit<TestRequest, 'owner' | 'questions'>>({ name: '', numberOfquestions: 4, courseName: '', courseSubject: '', prompt: '', documentUrls: [] })
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');

    useEffect(() => setError(false), [testData])

    const { data: session, status } = useSession();


    const submit = async () => {
        if (!session?.user?.email) return
        if (testData.name.length === 0 || testData.courseName.length === 0 || testData.courseSubject.length === 0) {
            setError(true);
            setErrorMsg('Test name, course name, and subject are required');
            return;
        }

        if (testData.documentUrls.length < 1) {
            setError(true);
            setErrorMsg('Please input at least one course material');
            return;
        }

        try {
            setLoading(true);

            const newTest: Omit<TestRequest, 'questions'> = {
                owner: session.user.email,
                ...testData
            };

            const response = await fetch('/api/tests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTest)
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }

            router.push(response.headers.get('location')!)
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setTestData({ ...testData, documentUrls: [] })
            setError(true)
            setErrorMsg("Error Generating Test. Please re-upload files and try again.")
        }
    }

    if (loading) return <GenLoadingPage />

    return (
        <>
            <div className="container min-h-screen w-full md:w-2/3 p-6">

                <div className="mb-6 p-6 rounded-lg border bg-background shadow-md flex flex-col">
                    <div className="col-span-2 grid grid-cols-6 w-full items-end gap-1.5 pb-1">
                        <div className="md:col-span-5 col-span-4">
                            <Label htmlFor="Test Name" className="text-xs text-gray-500">Test Name:</Label>
                            <Input
                                type="text"
                                id="test-name"
                                placeholder="Example Quiz"
                                value={testData.name}
                                onChange={e => setTestData((prevTestData) => {
                                    return { ...prevTestData, name: e.target.value }
                                })}
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Label htmlFor="Test Name" className="text-xs text-gray-500"># of Questions:</Label>
                            <Input
                                type="number"
                                id="test-questions"
                                placeholder="5"
                                max={20}
                                min={1}
                                value={testData.numberOfquestions}
                                onChange={e => setTestData((prevTestData) => {
                                    return { ...prevTestData, numberOfquestions: Number(e.target.value) }
                                })}
                            />
                        </div>
                    </div>
                    <div className="pt-2 pb-4 grid gap-2 grid-rows-auto grid-cols-1 md:grid-cols-2">

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="Course Name" className="text-xs text-gray-500">Course Name:</Label>
                            <Input
                                type="text"
                                id="course-name"
                                placeholder="Linear Algebra"
                                value={testData.courseName}
                                onChange={e => setTestData((prevTestData) => {
                                    return { ...prevTestData, courseName: e.target.value }
                                })}
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="Course Subject" className="text-xs text-gray-500">Subject:</Label>
                            <Input
                                type="text"
                                id="course-subject"
                                placeholder="Math"
                                value={testData.courseSubject}
                                onChange={e => setTestData((prevTestData) => {
                                    return { ...prevTestData, courseSubject: e.target.value }
                                })}
                            />
                        </div>
                    </div>
                    <div className="pb-4 grid w-full items-center gap-1.5">
                        <Label htmlFor="Test Prompt" className="text-xs text-gray-500">Instructions:</Label>
                        <Textarea
                            id="test-prompt"
                            placeholder="The difficulty level should be appropriate for 10th grade high school students."
                            value={testData.prompt}
                            onChange={e => setTestData((prevTestData) => {
                                return { ...prevTestData, prompt: e.target.value }
                            })}
                        />
                    </div>
                    <div className="pb-6 grid w-full items-center gap-1">
                        <Label htmlFor="Test Prompt" className="text-xs text-gray-500">Relevant Course Materials:</Label>
                        <FileUpload onFilesUploaded={urls => {
                            setTestData((prevTestData) => {
                                const documentUrls = [...prevTestData.documentUrls, ...urls]
                                return { ...prevTestData, documentUrls: documentUrls }
                            })
                        }} />
                    </div>
                    <Button
                        onClick={() => submit()}
                        variant={!error ? "default" : "destructive"}
                        className="w-full"
                        disabled={loading || error}
                    >
                        {loading ? (
                            <svg aria-hidden="true" className="w-6 h-6 text-background animate-spin fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        ) : error ? `${errorMsg}` : 'Save & Generate Test'}
                    </Button>
                </div>

            </div>
        </>
    );

}
