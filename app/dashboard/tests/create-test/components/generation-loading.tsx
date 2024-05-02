"use client"

import { useState, useEffect } from "react";


export default function GenLoadingPage() {
    const loadingTexts = [
        'Reading uploaded materials...',
        'Researching subject matter...',
        'Writing test...',
        'Cross-checking sources...',
        'Making editions...',
        'Almost done...'
    ];
    const totalTime = 20000; // in milliseconds
    const [progress, setProgress] = useState(0);
    const [textIndex, setTextIndex] = useState(0);
    const [nextTextChange, setNextTextChange] = useState(totalTime / loadingTexts.length);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress < 100) {
                    return oldProgress + 1;
                }
                clearInterval(progressInterval);
                return 100;
            });
        }, totalTime / 100);

        return () => clearInterval(progressInterval);
    }, [totalTime]);

    useEffect(() => {
        if (textIndex < loadingTexts.length - 1) {
            const timeout = setTimeout(() => {
                setTextIndex(textIndex + 1);
                // Calculate the time for the next text change, reducing the interval each time
                const remainingTime = totalTime - (totalTime / loadingTexts.length) * (textIndex + 1);
                const nextInterval = remainingTime / (loadingTexts.length - (textIndex + 1));
                setNextTextChange(nextInterval);
            }, nextTextChange);

            return () => clearTimeout(timeout);
        }
    }, [textIndex, nextTextChange, loadingTexts.length]);

    const currentText = loadingTexts[textIndex];


    return (
        <div className="flex w-full items-center justify-center h-screen">
            <div className="text-center w-full flex flex-col items-center">
                <div className="w-3/5 bg-gray-300/20 h-8 rounded-full overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-primary to-cyan-400 h-8 transition-all duration-500 ease-linear"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="text-lg font-bold text-gray-500 mt-3">
                    {currentText}
                </div>
            </div>
        </div>
    );
};