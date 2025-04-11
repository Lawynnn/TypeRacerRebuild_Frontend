"use client";
import { RoomMessage, RoomUser, User } from "@/app/types/socketEventTypes";
import useAPI from "@/hooks/useAPI";
import { useSocket } from "@/hooks/useSocket";
import { useTabs } from "@/hooks/useTabs";
import React from "react";
import UserCard from "./UserCard";
import Container from "./Container";
import SecretInput from "./SecretInput";
import Chat from "./Chat";
import config from "@/config";

export default function Room() {
    const { socket } = useSocket();
    const { data, setActiveTab } = useTabs();
    const [users, setUsers] = React.useState<RoomUser[]>(
        data?.data?.users || []
    );
    const [user, setUser] = React.useState<User>(data?.user);
    const [isHost, setIsHost] = React.useState<boolean>(false);

    React.useEffect(() => {
        const host = users.find((u) => u.user.userId === user.userId)?.isHost;
        setIsHost(host || false);
    }, [users]);

    const [messages, setMessages] = React.useState<RoomMessage[]>([]);

    function handleUserJoined(d: any) {
        setUsers(d.users);
    }

    function handleUserDisconnected(d: any) {
        setUsers(d.users);
    }
    function handleRoomMessage(d: any) {
        setMessages((prev) => [...prev, d]);
    }

    function handleGameStarting(d: any) {
        setActiveTab(config.tabs.game, {
            data: data.data,
            user: data.user,
            game: {
                ROOM_LOAD_TIME: d.ROOM_LOAD_TIME,
                gameSettings: d.gameSettings
            }
        });
    }

    React.useEffect(() => {
        socket.on("user-joined", handleUserJoined);
        socket.on("user-disconnected", handleUserDisconnected);
        socket.on("room-message", handleRoomMessage);
        socket.on("game-starting", handleGameStarting);

        return () => {
            socket.off("user-joined", handleUserJoined);
            socket.off("user-disconnected", handleUserDisconnected);
            socket.off("room-message", handleRoomMessage);
            socket.off("game-starting", handleGameStarting);
        };
    }, [socket]);

    React.useEffect(() => {
        console.log("Room data changed", data);
    }, [data]);

    return (
        <div className="w-full h-full overflow-hidden flex flex-col justify-center items-center gap-4">
            <Container className="gap-3">
                <div className="flex flex-row w-full items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl">{data?.data?.name}</span>
                        <span className="text-sm text-gray-500">
                            {users.length} players connected
                        </span>
                    </div>
                    <button
                        className="text-red-500 cursor-pointer transition-colors duration-200 ease-in-out p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30"
                        onClick={() => {
                            window.location.reload();
                        }}
                    >
                        Leave Room
                    </button>
                </div>

                <SecretInput value={data?.data?.code} />
                <div className="flex flex-col gap-2 w-full h-fit p-5 rounded-lg bg-zinc-700/50">
                    {users.map((u) => (
                        <UserCard
                            key={u.user.userId}
                            currentUser={data.user}
                            user={u}
                        />
                    ))}
                </div>
                <Chat messages={messages} />
                <div className="flex flex-row items-center w-full">
                    {(() => {
                        if (users.length < 2) {
                            return (
                                <span className="text-red-500">
                                    Waiting for more players...
                                </span>
                            );
                        } else if (isHost) {
                            // render the button
                            return (
                                <button
                                    className="text-white rounded-lg p-2 bg-blue-500 hover:bg-blue-600 transition-colors duration-200 ease-in-out cursor-pointer"
                                    onClick={() => {
                                        socket.emit("start-game");
                                    }}
                                >
                                    Start Game
                                </button>
                            );
                        }

                        return (
                            <span>Waiting for host to start the game...</span>
                        );
                    })()}
                </div>
            </Container>
        </div>
    );
}
