"use client";
import React from "react";
import config from "@/config";
import useAPI from "@/hooks/useAPI";
import { APIResponse, User } from "@/app/types/apiTypes";
import CreateRoom from "@/components/CreateRoom";
import JoinRoom from "@/components/JoinRoom";
import { useTabs } from "@/hooks/useTabs";
import Room from "@/components/Room";
import { useSocket } from "@/hooks/useSocket";
import Game from "@/components/Game";

export default function Play() {
    const { user } = useAPI();
    const { setActiveTab, activeTab } = useTabs();
    const { socket } = useSocket();

    if(!user) {
        return (
            <div className="flex flex-col w-full h-full justify-center items-center gap-4">
                <h1 className="text-3xl">Loading...</h1>
            </div>
        )
    }

    if(activeTab === config.tabs.create_room) return <CreateRoom />;
    else if(activeTab === config.tabs.join_room) return <JoinRoom />;
    else if(activeTab === config.tabs.room) return <Room />;
    else if(activeTab === config.tabs.game) return <Game />;

    return (
        <div className="w-full h-full overflow-hidden flex flex-col justify-center items-center gap-4">
            <span>Play</span>
            <button className="cursor-pointer" onClick={e => setActiveTab(config.tabs.create_room, user)}>Create room</button>
            <button className="cursor-pointer" onClick={e => setActiveTab(config.tabs.join_room, user)}>Join room</button>
        </div>
    )
}