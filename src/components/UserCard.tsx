"use client";
import { User } from "@/app/types/apiTypes";
import { RoomUser } from "@/app/types/socketEventTypes";
import { Crown, X } from "lucide-react";
import React from "react";

export default function UserCard({ user, currentUser }: { user: RoomUser, currentUser: User }) {
    return (
        <div className="flex flex-row gap-2 items-center justify-between rounded-sm border border-white/15 p-2 w-full" data-pattern="stripes">

            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full w-5 h-5 mr-3" src={user.user.avatar} alt="User avatar" />
                {user.isHost && <Crown className="text-yellow-500" />}
                <span>{user.user.username}</span>
            </div>
            {/* {currentUser.globalHost && <div className="flex flex-row items-center gap-2">
                <button className="p-2 rounded-sm border border-white/15"><X /></button>
            </div>} */}
        </div>
    );
}
