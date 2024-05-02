"use client"

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getURL, handleDownloadAsPdf } from "@/lib/utils";
import { Test } from "@/app/types/test";


export default function PublishTest({ params }: { params: { testId: string } }) {
    const router = useRouter();

    const testId = params.testId;
    const [test, setTest] = useState<Test>()

    const getTest = async () => {
        const response = await fetch(`/api/tests/${testId}`)
        const test = await response.json()
        setTest(test)
    }

    useEffect(() => {
        getTest()
    }, []);


    const [displayLink, setDisplayLink] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const handleDownload = async () => {
        if (!test) return
        handleDownloadAsPdf(test);
    }

    const handleShowLink = async () => {
        setDisplayLink(true);
    }

    if (!test) {
        return (
            <>
                <div className="w-full h-screen flex flex-col justify-center items-center">
                    <Logo className="pt-2 h-24" />
                    <svg aria-hidden="true" className="mt-4 w-10 h-10 text-gray-300 animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="container w-full md:w-2/3 p-6">

                <div className="mb-8 p-6 rounded-lg border bg-background shadow-md flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-4">
                        <Button className="mr-2" variant="outline" onClick={() => handleDownload()}>Download as PDF</Button>
                        <Button variant="outline" onClick={() => handleShowLink()}>Display Testing Link</Button>
                    </div>

                    <div className="w-full">
                        <div className="text-primary font-bold text-center text-xl underline opacity-90 mb-2">
                            {test.testName}
                        </div>
                        {test.questions.map((question, index) => (
                            <div key={index} className="grid w-full items-center gap-1.5 mb-4">
                                <div className="">
                                    <span className="font-bold">{index + 1}. </span>
                                    <span dangerouslySetInnerHTML={{ __html: question.questionText.replace(/\n/g, '<br>') }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full flex flex-col items-center">
                        <Button className="w-full mb-2" onClick={() => router.push("/dashboard/tests")}>
                            Continue to Dashboard
                        </Button>
                        <div className="text-gray-500 text-center text-xs">
                            Using the test link will allow your students to take this exam online, and performance metrics will be generated immediately.
                            If you wish to give this test on paper, you will have the opportunity to manually upload finished exams for each student.
                        </div>
                    </div>
                </div>
            </div>

            {displayLink ? (
                <div className="fixed top-0 z-20 h-screen w-full bg-muted-foreground/60 flex items-center justify-center" onClick={() => setDisplayLink(false)}>
                    <Card className="hover:text-primary cursor-pointer" onClick={e => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(`${getURL()}testing/${testId}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 3000)
                    }}>
                        <CardHeader className="w-full">
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