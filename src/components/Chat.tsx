"use client";
import { RoomMessage, RoomUser } from "@/app/types/socketEventTypes";
import { useSocket } from "@/hooks/useSocket";
import { Crown, Megaphone, Send } from "lucide-react";
import React from "react";

function formatDate(date: Date) {
    // format like: 5 apr. 2025 hh:mm:ss
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };
    return date.toLocaleString("en-US", options).replace(",", "");
}

export default function Chat({ messages }: { messages: RoomMessage[] }) {
    const { socket, isConnected } = useSocket();
    const [input, setInput] = React.useState<string>("");
    const [disabled, setDisabled] = React.useState<boolean>(true);
    const ref = React.useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, ref]);
    return (
        <div className="w-full h-fit flex flex-col gap-2 rounded-lg bg-zinc-700/50 p-5 overflow-hidden">
            <div className="flex flex-col max-h-[200px] min-h-[50px] gap-2 overflow-y-auto overflow-x-hidden" ref={ref}>
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className="flex flex-col gap-0 rounded-sm p-1 w-full"
                    >
                        <div className="flex flex-row items-center gap-2">
                            {!m.sender.isBroadcast ? (
                                <>
                                    <img
                                        className="rounded-full w-5 h-5"
                                        src={m.sender.user.avatar}
                                        alt="User avatar"
                                    />
                                    <span className="text-sm flex flex-row gap-2 items-center">
                                        {m.sender.user.username}
                                        <span className="text-zinc-600 text-xs">{formatDate(new Date(m.timestamp))}</span>
                                    </span>
                                </>
                            ) : (
                                <span className="text-yellow-300 text-sm flex flex-row gap-2 items-center">
                                    <Megaphone />
                                    ( broadcast )
                                    <span className="text-zinc-600 text-xs">{formatDate(new Date(m.timestamp))}</span>
                                </span>
                            )}
                        </div>
                        <span className="text-wrap text-sm text-zinc-400">{m.message}</span>
                    </div>
                ))}
            </div>
            <form className="w-full flex flex-row">
                <input
                    className="flex-1 outline-0 bg-zinc-900 border border-white/15 rounded-lg p-2 rounded-tr-none rounded-br-none"
                    placeholder="Enter a message..."
                    type="text"
                    value={input}
                    onInput={(e) => {
                        if (e.currentTarget.value.length > 100) {
                            setDisabled(true);
                        }
                        else if (e.currentTarget.value.length < 1) {
                            setDisabled(true);
                        }
                        else {
                            setDisabled(false);
                        }
                        setInput(e.currentTarget.value)
                    }}
                    min={1}
                    max={100}
                />
                <button
                    type="submit"
                    disabled={disabled}
                    className="flex flex-row items-center gap-2 border border-l-0 border-white/15 rounded-lg rounded-bl-none rounded-tl-none
                    p-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200
                    disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isConnected) return;
                        socket.emit("send-message", { message: input });
                        setDisabled(true);
                        setInput("");
                    }}
                >
                    <Send size={15} className="text-white" />
                    Send
                </button>
            </form>
        </div>
    );
}
