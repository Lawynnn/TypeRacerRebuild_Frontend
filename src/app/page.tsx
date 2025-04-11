"use client";
import config from "@/config";
import { useSocket } from "@/hooks/useSocket";
import { useTabs } from "@/hooks/useTabs";
import React from "react";

export default function Home() {
    return (
        <div>
            <h1 className="text-3xl">Home</h1>
            <p className="text-xl">Welcome to the home page!</p>
        </div>
    );
}
