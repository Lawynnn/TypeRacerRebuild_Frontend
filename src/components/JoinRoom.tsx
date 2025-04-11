"use client";
import config from "@/config";
import { useError } from "@/hooks/useError";
import { useSocket } from "@/hooks/useSocket";
import { useTabs } from "@/hooks/useTabs";
import React from "react";

export default function JoinRoom() {
    const { isConnected, socket } = useSocket();
    const { setActiveTab, data } = useTabs();
    const { setError } = useError();
    if(!isConnected) {
        return <span className="text-red-500">Disconnected</span>;
    }

    const [roomCode, setRoomCode] = React.useState<string>("");
    const [roomPassword, setRoomPassword] = React.useState<string>("");

    function handleRoomJoined(d: any) {
        console.log(`You successfully joined the room ${d.name}`);
        setActiveTab(config.tabs.room, {
            data: d,
            user: data
        });
    }

    function handleRoomError(error: any) {
        setError(error);
    }

    React.useEffect(() => {
        socket.on("room-joined", handleRoomJoined)
        socket.on("room-error", handleRoomError);

        return () => {
            socket.off("room-joined", handleRoomJoined);
            socket.off("room-error", handleRoomError);
        }
    }, [socket]);

    return (
        <div className="flex flex-col gap-2">
            <input
                type="text"
                placeholder="Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="border border-gray-300 p-2 rounded"
            />
            <input
                type="password"
                placeholder="Room Password"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                className="border border-gray-300 p-2 rounded"
            />
            <button
                onClick={() => {
                    if (!socket) return;
                    socket.emit("join-room", {
                        roomCode,
                        roomPassword,
                    });
                }}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
            >
                Join Room
            </button>
        </div>
    )
}