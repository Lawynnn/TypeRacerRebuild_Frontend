"use client";
import config from "@/config";
import { useError } from "@/hooks/useError";
import { useSocket } from "@/hooks/useSocket";
import { useTabs } from "@/hooks/useTabs";
import React from "react";

export default function CreateRoom() {
    const { socket, isConnected } = useSocket();
    const { setError } = useError();
    const { setActiveTab, data } = useTabs();

    if (!isConnected) {
        return <span className="text-red-500">Disconnected</span>;
    }

    const [roomName, setRoomName] = React.useState<string>("");
    const [roomPassword, setRoomPassword] = React.useState<string>("");

    function handleRoomCreated(d: any) {
        console.log("Room created", d);
        setActiveTab(config.tabs.room, {
            data: d,
            user: data
        });
    }

    function handleRoomError(error: any) {
        setError(error);
    }

    React.useEffect(() => {
        socket.on("room-created", handleRoomCreated);
        socket.on("room-error", handleRoomError);


        return () => {
            socket.off("room-created", handleRoomCreated);
            socket.off("room-error", handleRoomError);
        };
    }, [socket]);

    return (
        <div className="flex flex-col gap-2">
            <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
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
                    socket.emit("create-room", {
                        roomName,
                        roomPassword,
                        settings: {},
                    });
                    setRoomName("");
                    setRoomPassword("");
                }}
                className="bg-blue-500 text-white p-2 rounded cursor-pointer"
            >
                Create Room
            </button>
        </div>
    );
}
