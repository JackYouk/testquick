"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { StarsIcon } from "lucide-react";
import { Question } from "@prisma/client";

interface AiHintsHelperProps {
    className: string;
    threadId: string;
    questions: Question[];
    responses: string[];
}

export function AiHintsHelper({ className, threadId, questions, responses }: AiHintsHelperProps) {

    // State for tracking drag position
    const [position, setPosition] = React.useState({ x: window.innerWidth > 1400 ? -255 : window.innerWidth > 700 ? -235 : -260, y: window.innerWidth > 700 ? 45 : -500 });
    const popoverRef = React.useRef<HTMLDivElement>(null); // Ref for the popover content
    const [isDragging, setIsDragging] = React.useState(false);
    const [startPosition, setStartPosition] = React.useState({ x: 0, y: 0 });

    // Drag handlers
    const startDrag = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartPosition({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const onDrag = (e: MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - startPosition.x,
                y: e.clientY - startPosition.y,
            });
        }
    };

    const endDrag = () => {
        setIsDragging(false);
    };

    // Effect to add and remove event listeners
    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', onDrag);
            window.addEventListener('mouseup', endDrag);
        }

        return () => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', endDrag);
        };
    }, [isDragging, onDrag]);

    const [aiHint, setAiHint] = React.useState<string>('');
    const [hintPrompt, setHintPrompt] = React.useState<string>('');
    const [hintLoading, setHintLoading] = React.useState<boolean>(false);
    const [hintError, setHintError] = React.useState<boolean>(false);
    const [hintErrMsg, setHintErrMsg] = React.useState<string>('');
    const generateHint = async () => {
        if (!threadId || !questions) {
            setHintErrMsg('An error occured. Please refresh page and try again.');
            setHintError(true);
            setTimeout(() => setHintError(false), 4000);
            return;
        }
        if (hintPrompt.length === 0) {
            setHintErrMsg('Hint prompt is required...');
            setHintError(true);
            setTimeout(() => setHintError(false), 3000);
            return;
        }
        setHintLoading(true);
        console.log({ threadId, hintPrompt, questions })
        try {
            const response = await fetch('/api/tests/suggestHint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    threadId,
                    hintPrompt,
                    testQuestions: questions,
                    studentResponses: responses
                })
            });
            if (!response.ok) {
                throw new Error("Failed to submit suggestion due to server error");
            }
            const newSuggestedQuestions = await response.json();
            setHintLoading(false);
            setAiHint(newSuggestedQuestions.questions);
            setHintPrompt("");
        } catch (err) {
            console.error(err);
            setHintLoading(false);
            setHintErrMsg('An error occured. Please try again.');
            setHintError(true);
            setTimeout(() => setHintError(false), 4000);
        }
    };

    return (
        <div className={className}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                        <StarsIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                        <span className="sr-only">Toggle ai hints helper</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    ref={popoverRef}
                    className="w-80"
                    style={{ position: 'absolute', left: position.x, top: position.y, cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={startDrag}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-bold flex items-center">Ai Hints <StarsIcon className="ml-1 w-4 h-4" /></div>
                        {aiHint ? <div
                            onClick={() => setAiHint('')}
                            className="text-xs bg-gray-100 rounded-md font-bold py-1 px-1.5 cursor-pointer"
                        >clear</div> : <></>}
                    </div>
                    {aiHint ? <div className="mb-2 text-sm">
                        {aiHint}
                    </div> : <></>}
                    <div className="grid gap-4">
                        <Textarea
                            placeholder="I'm stuck, can you help with question 1?"
                            className=""
                            value={hintPrompt}
                            onChange={e => setHintPrompt(e.target.value)}
                            onPointerEnter={e => e.stopPropagation()}
                        />
                        <Button
                            type="button"
                            variant={hintError ? "destructive" : "secondary"}
                            onClick={() => generateHint()}
                            disabled={hintLoading || hintError}
                        >
                            {hintLoading ?
                                <svg aria-hidden="true" className="w-6 h-6 text-primary animate-spin fill-background" viewBox="0 0 100 101" fill="none" opacity="50%" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                : hintError ?
                                    <>{hintErrMsg}</>
                                    : <>Generate Hint <StarsIcon className="ml-2 w-4 h-4" /></>}
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}