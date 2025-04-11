"use client";
import config from "@/config";
import { useSocket } from "@/hooks/useSocket";
import { useTabs } from "@/hooks/useTabs";
import React from "react";
import KeyboardTyping from "./KeyboardTyping";

export default function Game() {
    const { socket } = useSocket();
    const { data, setActiveTab } = useTabs();
    const [quote, setQuote] = React.useState("");
    const [time, setTime] = React.useState(-1);
    const [gameDuration, setGameDuration] = React.useState(0);

    function handleGameError(error: string) {
        console.error("Game error:", error);
    }

    function handleGameStart(data: any) {
        console.log("Game started", data);
        setQuote(data.quote);
        setGameDuration(data.endTimestamp);
    }

    function handleGameEnded(d: any) {
        console.log("Game ended", d);
        const finalData = {
            ...data,
            game: d,
        }
        finalData.data.users = d.users;
        setActiveTab(config.tabs.room, finalData);
    }

    function handleGameTyped(d: any) {
        console.log("Game typed", d);
    }

    function handleUserDisconnected(d: any) {
        console.log("User disconnected", d);
    }

    function handlePlayerFinished(d: any) {
        console.log("Player finished", d);
    }


    React.useEffect(() => {
        socket.on("game-error", handleGameError);
        socket.on("game-started", handleGameStart);
        socket.on("game-ended", handleGameEnded);
        socket.on("game-typed", handleGameTyped)
        socket.on("user-disconnected", handleUserDisconnected);
        socket.on("player-finished", handlePlayerFinished);
        return () => {
            socket.off("game-error", handleGameError);
            socket.off("game-started", handleGameStart);
            socket.off("game-ended", handleGameEnded);
            socket.off("game-typed", handleGameTyped);
            socket.off("user-disconnected", handleUserDisconnected);
            socket.off("player-finished", handlePlayerFinished);
        };
    }, [socket]);

    React.useEffect(() => {
        if (!gameDuration) return;

        const endTime = new Date(gameDuration).getTime();
        const getTimeLeft = () => {
            const now = Date.now();
            const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000)) + 1;
            return timeLeft;
        }
        setTime(getTimeLeft());
        const interval = setInterval(() => {
            const tm = getTimeLeft();
            setTime(tm);

            if (tm <= 0) {
                clearInterval(interval);
            }
        }
        , 1000);

        return () => {
            clearInterval(interval);
        };
    }, [gameDuration]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-5">
            <h1 className="text-3xl">Game</h1>
            <p className="text-xl">Time left: {time} seconds</p>
            <p className="text-xl">Welcome to the game page!</p>
            {quote && <KeyboardTyping quote={quote} onLetterSubmit={(letter, words, idx) => {
                if(!socket) return;

                socket.emit("game-typing", {
                    letter,
                    words,
                    idx
                });
            }}/>}
        </div>
    );
}
