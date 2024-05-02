"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { CalculatorIcon } from "lucide-react";

export function CalculatorHelper({ className }: React.HTMLAttributes<HTMLElement>) {
    const [display, setDisplay] = React.useState<string>("0");
    const [previousValue, setPreviousValue] = React.useState<number | null>(null);
    const [operator, setOperator] = React.useState<string | null>(null);
    const [waitingForNewValue, setWaitingForNewValue] = React.useState<boolean>(false);

    // State for tracking drag position
    const [position, setPosition] = React.useState({ x: window.innerWidth > 1400 ? -220 : window.innerWidth > 700 ? -215 : -220, y: window.innerWidth > 700 ? 45 : -400 });
    const popoverRef = React.useRef<HTMLDivElement>(null); // Ref for the popover content
    const [isDragging, setIsDragging] = React.useState(false);
    const [startPosition, setStartPosition] = React.useState({ x: 0, y: 0 });

    const handleNumberPress = (number: string) => {
        if (waitingForNewValue) {
            setDisplay(number);
            setWaitingForNewValue(false);
        } else {
            setDisplay(display === "0" ? number : display + number);
        }
    };
    const handleOperationPress = (operation: string) => {
        if (previousValue == null) {
            setPreviousValue(parseFloat(display));
        } else if (operator) {
            const currentValue = parseFloat(display);
            const newValue = calculate(previousValue, currentValue, operator);
            setDisplay(String(newValue));
            setPreviousValue(newValue);
        }
        setWaitingForNewValue(true);
        setOperator(operation);
    };
    const toggleSign = () => {
        // If the display value is not zero, prepend or remove a '-' sign
        setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display);
    };

    const calculate = (a: number, b: number, operation: string): number => {
        switch (operation) {
            case "+":
                return a + b;
            case "-":
                return a - b;
            case "x":
                return a * b;
            case "/":
                return a / b;
            default:
                return b;
        }
    };

    const handleEqualsPress = () => {
        if (operator != null && previousValue != null) {
            const currentValue = parseFloat(display);
            const newValue = calculate(previousValue, currentValue, operator);
            setDisplay(String(newValue));
            setPreviousValue(null);
            setOperator(null);
            setWaitingForNewValue(true);
        }
    };

    const handleClearPress = () => {
        setDisplay("0");
        setPreviousValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
    };

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

    return (
        <div className={className}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                        <CalculatorIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                        <span className="sr-only">Toggle calculator helper</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    ref={popoverRef}
                    className="w-80"
                    style={{ position: 'absolute', left: position.x, top: position.y, cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={startDrag}
                >
                    <div className="grid gap-4">
                        <div className="rounded border border-gray-200 dark:border-gray-800 w-full p-4 overflow-x-scroll">
                            <div className="font-mono text-2xl h-10 flex items-center justify-end">{display}</div>
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {[1, 2, 3].map((number) =>
                                <Button key={'calcBtn' + number} size="sm" variant="secondary" onClick={() => handleNumberPress(number.toString())}>{number}</Button>
                            )}
                            <Button size="sm" variant="secondary" onClick={() => handleOperationPress("/")}>/</Button>
                            <Button size="sm" variant="secondary" onClick={() => handleOperationPress("x")}>x</Button>
                            {[4, 5, 6].map((number) =>
                                <Button key={'calcBtn' + number} size="sm" variant="secondary" onClick={() => handleNumberPress(number.toString())}>{number}</Button>
                            )}
                            <Button size="sm" variant="secondary" onClick={() => handleOperationPress("+")}>+</Button>
                            <Button size="sm" variant="secondary" onClick={() => handleOperationPress("-")}>-</Button>
                            {[7, 8, 9].map((number) =>
                                <Button key={'calcBtn' + number} size="sm" variant="secondary" onClick={() => handleNumberPress(number.toString())}>{number}</Button>
                            )}
                            <Button size="sm" variant="secondary" className="col-span-2" onClick={handleEqualsPress}>=</Button>
                            <Button size="sm" variant="secondary" onClick={() => handleNumberPress(".")}>.</Button>
                            <Button key={'calcBtn' + 0} size="sm" variant="secondary" onClick={() => handleNumberPress("0")}>{0}</Button>
                            <Button size="sm" variant="secondary" onClick={toggleSign}>±</Button>
                            <Button size="sm" variant="secondary" className="col-span-2" onClick={handleClearPress}>CLEAR</Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
