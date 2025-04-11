"use client";

import Container from "@/components/Container";
import { useSocket } from "@/hooks/useSocket";
import React from "react";

export default function KeyboardTyping({
    quote,
    onWordFinish = null,
    onLetterSubmit = null,
    onTextChange = null,
}: {
    quote: string;
    onWordFinish?: ((word: string, index: number) => void) | null;
    onLetterSubmit?: ((letter: string, words: string[], idx: number) => void) | null;
    onTextChange?: ((text: string) => void) | null;
}) {
    // const { socket } = useSocket();
    const [words, setWords] = React.useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
    const [cursorData, setCursorData] = React.useState<{
        x: number;
        y: number;
        height: number;
    }>({
        x: 0,
        y: 0,
        height: 0,
    });

    const cursorRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const quoteWords = quote.split(" ");

    const currentInput = words[currentWordIndex] || "";

    const moveCursor = () => {
        const charElements = containerRef.current?.querySelectorAll(
            ".char, .excess-char span"
        );
        if (!charElements) return;

        let totalTypedChars = 0;
        for (let i = 0; i < currentWordIndex; i++) {
            const typedWord = words[i] || "";
            totalTypedChars += typedWord.length;
        }

        const typed = words[currentWordIndex] || "";
        const quoteWord = quoteWords[currentWordIndex] || "";

        const excessCount = Math.max(0, typed.length - quoteWord.length);
        const safeLength = Math.min(typed.length, quoteWord.length);

        // Indexul real în DOM (inclusiv caracterele în exces dacă există)
        const currentCharIndex = totalTypedChars + safeLength - 1 + excessCount;

        // Dacă nu e scris nimic încă la cuvântul curent
        const isAtWordStart = typed.length === 0;

        const currentChar = isAtWordStart
            ? charElements[totalTypedChars]
            : charElements[currentCharIndex];

        if (currentChar) {
            const charRect = (
                currentChar as HTMLElement
            ).getBoundingClientRect();
            const parentRect = containerRef.current!.getBoundingClientRect();

            const x = isAtWordStart
                ? charRect.left - parentRect.left
                : charRect.right - parentRect.left;

            setCursorData({
                x,
                y: charRect.top - parentRect.top,
                height: charRect.height,
            });
        }
    };

    React.useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            
            setWords((prev) => {
                const newWords = [...prev];
                const current = newWords[currentWordIndex] || "";

                if (e.key === "Backspace") {
                    if (current.length === 0 && currentWordIndex > 0) {
                        const previousWord = newWords[currentWordIndex - 1];
                        const quoteWord = quoteWords[currentWordIndex - 1];

                        if (previousWord !== quoteWord) {
                            // mergem înapoi DOAR cu -1
                            setCurrentWordIndex(currentWordIndex - 1);
                        }
                        return newWords;
                    }

                    newWords[currentWordIndex] = current.slice(0, -1);
                    return newWords;
                }

                if (e.key === " " || e.key === "Spacebar") {
                    newWords[currentWordIndex] = current;
                    if (currentWordIndex < quoteWords.length - 1) {
                        setCurrentWordIndex(currentWordIndex + 1);
                        onWordFinish && onWordFinish(current, currentWordIndex);
                    }
                    return newWords;
                }

                if (e.key.length === 1) {
                    newWords[currentWordIndex] = current + e.key;
                    onLetterSubmit && onLetterSubmit(e.key, newWords, currentWordIndex);
                    return newWords;
                }

                const fullText = newWords.join(" ");
                onTextChange && onTextChange(fullText);
                return newWords;
            });
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [currentWordIndex, quoteWords]);

    React.useEffect(() => {
        moveCursor();
    }, [words, currentWordIndex]);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <Container>
                <span className="mb-4 block text-white/70">Start typing...</span>
                <div
                    ref={containerRef}
                    className="relative w-full text-white text-4xl font-mono leading-relaxed tracking-wide break-words whitespace-pre-wrap"
                >
                    {quote.split(" ").map((word, i) => {
                        const userWord = words[i] || ""; // Cuvântul tastat de utilizator
                        const isActive = i === currentWordIndex;
                        const isCorrect = userWord === word;
                        const isUntouched = userWord.length === 0;

                        const baseColor = isUntouched
                            ? "text-white/30"
                            : isCorrect
                            ? "text-white"
                            : "text-red-500 underline";

                        const excessLetters =
                            userWord.length > word.length
                                ? userWord.slice(word.length)
                                : "";

                        return (
                            <span
                                key={i}
                                className={`mr-3 word inline-block transition-all ${
                                    !isActive && !isCorrect && !isUntouched
                                        ? "relative after:content-[''] after:absolute after:bottom-[8px] after:left-0 after:w-full after:h-[.1rem] after:bg-red-500"
                                        : ""
                                }`}
                            >
                                {word.split("").map((char, j) => {
                                    const userChar = userWord[j];
                                    const isCorrectChar = userChar === char;
                                    const isNotTyped = userChar === undefined;

                                    let color = "text-red-500";
                                    if (isCorrectChar) color = "text-white";
                                    else if (isNotTyped)
                                        color = "text-white/30";

                                    return (
                                        <span
                                            key={j}
                                            className={`char inline-block whitespace-pre ${color}`}
                                        >
                                            {char}
                                        </span>
                                    );
                                })}

                                {/* Extra letters (user typed too much) */}
                                {excessLetters && (
                                    <span className="excess-char text-red-400">
                                        {excessLetters
                                            .split("")
                                            .map((char, j) => (
                                                <span
                                                    key={`excess-${i}-${j}`}
                                                    className="inline-block whitespace-pre"
                                                >
                                                    {char}
                                                </span>
                                            ))}
                                    </span>
                                )}
                            </span>
                        );
                    })}

                    <div
                        ref={cursorRef}
                        style={{
                            height: `${cursorData.height}px`,
                            transform: `translate(${cursorData.x}px, ${cursorData.y}px)`,
                        }}
                        className="absolute left-0 top-0 w-[.2rem] bg-amber-500 rounded-sm z-10 animate-cursor-blink transition-transform duration-75 ease-in-out"
                    ></div>
                </div>
            </Container>
        </div>
    );
}
