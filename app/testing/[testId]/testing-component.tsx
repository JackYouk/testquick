import { NovelEditor } from '@/components/texteditor/novel-editor/editor';
import { TextEditor } from '@/components/texteditor/texteditor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';

interface Question {
    questionText: string;
}

interface Props {
    test: {
        questions: Question[];
    };
    responses: string[];
    handleResponseChange: (response: string, index: number) => void;
    submitQuestions: () => void;
    error: boolean;
    errorMsg: string;
    loading: boolean;
}

const TestComponent: React.FC<Props> = ({ test, responses, handleResponseChange, submitQuestions, error, errorMsg, loading }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
    const isConfirmationStep = currentQuestionIndex === test.questions.length;

    const goToQuestion = (index: number): void => {
        setCurrentQuestionIndex(index);
    };

    const renderStepper = (): JSX.Element => {
        return (
            <div className="flex justify-start flex-wrap md:w-2/3">
                {test.questions.map((_, index) => (
                    <Button
                        key={index}
                        className="mr-2 mb-2"
                        size="sm"
                        variant={currentQuestionIndex === index ? "secondary" : "outline"}
                        onClick={() => goToQuestion(index)}
                    >{index + 1}</Button>
                ))}
                <Button
                    size="sm"
                    variant={isConfirmationStep ? "secondary" : "outline"}
                    onClick={() => goToQuestion(test.questions.length)}
                >All</Button>
            </div>
        );
    };


    return (
        <div className="w-full">
            {!isConfirmationStep ? (
                <div className="grid w-full items-center gap-1.5 mb-6">
                    <Label htmlFor={`question-${currentQuestionIndex}`} className="text-primary font-bold">
                        Question {currentQuestionIndex + 1}
                    </Label>
                    <div dangerouslySetInnerHTML={{ __html: test.questions[currentQuestionIndex].questionText.replace(/\n/g, '<br>') }} />
                    <Textarea
                        id={`response-${currentQuestionIndex}`}
                        placeholder=""
                        className='mt-1'
                        rows={10}
                        value={responses[currentQuestionIndex]}
                        onChange={e => handleResponseChange(e.target.value, currentQuestionIndex)}
                    />
                    {/* <TextEditor
                        id={`response-${currentQuestionIndex}`}
                        className="mt-4"
                        placeholder=""
                        value={responses[currentQuestionIndex]}
                        currentQuestionIndex={currentQuestionIndex}
                        handleResponseChange={handleResponseChange}
                    /> */}
                    {/* <NovelEditor onChange={e => console.log(e)} /> */}
                </div>
            ) : (
                <>
                    {test.questions.map((question: Question, index: number) => (
                        <div key={index} className="grid w-full items-center gap-1.5 mb-6">
                            <Label htmlFor={`question-${index}`} className="text-primary font-bold">Question {index + 1}</Label>
                            <div className="" dangerouslySetInnerHTML={{ __html: question.questionText.replace(/\n/g, '<br>') }} />
                            <Textarea
                                id={`response-${index}`}
                                placeholder=""
                                value={responses[index]}
                                onChange={e => handleResponseChange(e.target.value, index)}
                            />
                        </div>
                    ))}
                </>
            )}
            <div className="md:flex md:justify-between">
                {renderStepper()}
                <Button
                    onClick={() => {
                        if (isConfirmationStep) {
                            submitQuestions();
                        } else {
                            goToQuestion(currentQuestionIndex + 1);
                        }
                    }}
                    variant={error ? "destructive" : loading ? "secondary" : "default"}
                    size="sm"
                    className={isConfirmationStep && !error && !loading ? "bg-green-400 hover:bg-green-400/80" : ""}
                    disabled={loading || error}
                >
                    {error ? errorMsg :
                        loading ? (
                            <svg aria-hidden="true" className="w-6 h-6 text-primary animate-spin fill-background" viewBox="0 0 100 101" fill="none" opacity="50%" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        ) : error ? errorMsg : isLastQuestion ? 'Confirm Responses' : isConfirmationStep ? 'Submit' : 'Next Question'}
                </Button>
            </div>
        </div>
    );
}

export default TestComponent;
