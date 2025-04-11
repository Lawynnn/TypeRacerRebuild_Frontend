"use client";
import { Copy } from "lucide-react";
import React from "react";

export default function SecretInput({ value }: { value: string }) {
    const defaultState = "Click to copy invite code";
    const [text, setText] = React.useState(defaultState);
    return (
        <div className="flex flex-row items-center w-full px-5 rounded-lg bg-zinc-700/50 gap-2 cursor-pointer relative" onClick={e => {
            if(text !== defaultState) return;
            navigator.clipboard.writeText(value).then(() => {
                setText("Copied!");
                setTimeout(() => {
                    setText(defaultState);
                }, 1000);
            }).catch((err) => {
                console.error("Failed to copy text: ", err);
            });
            e.stopPropagation();
        }}>
            <span className="flex-1">{text}</span>
            <button className="py-5 pointer-events-none"><Copy /></button>
        </div>
    )
}