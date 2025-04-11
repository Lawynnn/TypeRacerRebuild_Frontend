"use client";
import Link from "next/link";
import React from "react";
import config from "@/config";

export default function Auth() {

    return (
        <div className="flex flex-col w-full h-full justify-center items-center gap-4">
            <h1 className="text-3xl">Authenticate</h1>
            <Link href={`${config.backend_url}/api/auth/google`} className="bg-zinc-800 text-zinc-50 px-4 py-2 rounded-md hover:bg-zinc-700 transition-colors duration-200">
                Auth with Google
            </Link>
            <Link href={`${config.backend_url}/api/auth/github`} className="bg-zinc-800 p-5 text-zinc-50 px-4 py-2 rounded-md hover:bg-zinc-700 transition-colors duration-200">
                Auth with Github
            </Link>
        </div>
    )
}