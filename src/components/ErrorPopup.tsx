"use client";
import { TriangleAlert, X } from "lucide-react";
import React from "react";

export default function ErrorPopup({
    show,
    error,
    onClose,
}: {
    show: boolean;
    error?: string | null;
    onClose?: () => void;
}) {
    return (
        <div
            onClick={(e) => {
                if (e.target === e.currentTarget && onClose) onClose();
            }}
            data-show={`${show}`}
            className="fixed flex flex-col items-center justify-center top-0 left-0 w-full h-full backdrop-blur-2xl z-[50] bg-zinc-900/30 
            pointer-events-none opacity-0 show:pointer-events-auto show:opacity-100 transition-all duration-200"
        >
            <div className="bg-zinc-900 border border-white/15 rounded-sm w-fit h-fit p-5 flex flex-col items-start gap-2 max-w-[90%]" data-pattern="stripes">
                <div className="flex flex-row gap-3">
                    <TriangleAlert size={30} />
                    <span className="text-white text-xl">{error}</span>
                </div>
                <button
                    onClick={onClose}
                    className="flex flex-row items-center gap-3 w-fit h-fit p-2 pr-4 rounded-sm border border-white/15 text-zinc-50 cursor-pointer bg-zinc-900
                    transition-colors duration-200 hover:bg-zinc-800/50 active:bg-zinc-800/50"
                >
                    <X /> Close
                </button>
            </div>
        </div>
    );
}
