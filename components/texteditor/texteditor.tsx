import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CodeIcon, FontBoldIcon, FontItalicIcon, ImageIcon, ListBulletIcon, UnderlineIcon } from "@radix-ui/react-icons"
import { LinkIcon, ListOrderedIcon, PiIcon } from "lucide-react"
import { useState } from "react"
import MarkdownViewer from "./markdown-viewer"

interface TextEditorProps {
    id: string;
    className?: string;
    placeholder?: string;
    value: string;
    currentQuestionIndex: number;
    handleResponseChange: (newValue: string, currentQuestionIndex: number) => void;
}

export function TextEditor({ id, className, placeholder, value, currentQuestionIndex, handleResponseChange }: TextEditorProps) {
    const [textareaValue, setTextareaValue] = useState(value);

    function handleBoldButtonClick() {
        const newText = `${textareaValue}**bold**`;
        setTextareaValue(newText);
        handleResponseChange(newText, currentQuestionIndex);
    }

    function handleItalicButtonClick() {
        const newText = `${textareaValue}_italic_`;
        setTextareaValue(newText);
        handleResponseChange(newText, currentQuestionIndex);
    }

    function handleUnderlineButtonClick() {
        const newText = `${textareaValue}<u>underline</u>`;
        setTextareaValue(newText);
        handleResponseChange(newText, currentQuestionIndex);
    }

    function handlePiButtonClick() {
        const newText = `${textareaValue}\\pi`;
        setTextareaValue(newText);
        handleResponseChange(newText, currentQuestionIndex);
    }

    function handleThetaButtonClick() {
        const newText = `${textareaValue}\\theta`;
        setTextareaValue(newText);
        handleResponseChange(newText, currentQuestionIndex);
    }

    function handleIntegralButtonClick() {
        const newText = `${textareaValue}\\int`;
        setTextareaValue(newText);
        handleResponseChange(newText, currentQuestionIndex);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const newText = event.target.value;
        setTextareaValue(newText);
        handleResponseChange(newText, currentQuestionIndex);
    }

    return (
        <div className={cn("grid w-full max-w-3xl rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800", className)}>
            <div className="flex p-4 gap-4 items-center">
                <Button className="" size="icon" variant="outline" onClick={handleBoldButtonClick}>
                    <FontBoldIcon className="w-5 h-5" />
                    <span className="sr-only">Toggle bold</span>
                </Button>
                <Button className="" size="icon" variant="outline" onClick={handleItalicButtonClick}>
                    <FontItalicIcon className="w-5 h-5" />
                    <span className="sr-only">Toggle italic</span>
                </Button>
                <Button className="" size="icon" variant="outline" onClick={handleUnderlineButtonClick}>
                    <UnderlineIcon className="w-5 h-5" />
                    <span className="sr-only">Toggle underline</span>
                </Button>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="" size="icon" variant="outline">
                            <PiIcon className="w-5 h-5" />
                            <span className="sr-only">Open math symbols popover</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex items-center">
                        <Button className="mr-4" size="icon" variant="outline" onClick={handlePiButtonClick}>
                            𝝅
                            <span className="sr-only">pi Button</span>
                        </Button>
                        <Button className="mr-4" size="icon" variant="outline" onClick={handleThetaButtonClick}>
                            θ
                            <span className="sr-only">theta Button</span>
                        </Button>
                        <Button className="" size="icon" variant="outline" onClick={handleIntegralButtonClick}>
                            ∫
                            <span className="sr-only">integral Button</span>
                        </Button>
                    </PopoverContent>
                </Popover>
                <Button className="" size="icon" variant="outline">
                    <CodeIcon className="w-5 h-5" />
                    <span className="sr-only">Toggle code</span>
                </Button>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-800" />
                <Button className="" size="icon" variant="outline">
                    <ListBulletIcon className="w-5 h-5" />
                    <span className="sr-only">Toggle unordered list</span>
                </Button>
                <Button className="" size="icon" variant="outline">
                    <ListOrderedIcon className="w-5 h-5" />
                    <span className="sr-only">Toggle ordered list</span>
                </Button>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-800" />
                <Button className="" size="icon" variant="outline">
                    <LinkIcon className="w-5 h-5" />
                    <span className="sr-only">Insert link</span>
                </Button>
                <Button className="" size="icon" variant="outline">
                    <ImageIcon className="w-5 h-5" />
                    <span className="sr-only">Insert image</span>
                </Button>
            </div>
            <div className="grid p-4 gap-4 text-base leading-loose">
                <div className="grid gap-1.5">
                    <div className="relative h-48">
                        <textarea
                            id={id}
                            className="z-10 border-none outline-none w-full opacity-100 bg-transparent"
                            placeholder={placeholder ?? ""}
                            value={textareaValue}
                            onChange={handleInputChange}
                        />
                        <div
                            className="absolute top-0 left-0 right-0 bottom-0 overflow-auto"
                            style={{ pointerEvents: "none" }}
                        >
                            <MarkdownViewer>{textareaValue}</MarkdownViewer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}