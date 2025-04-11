"use client";
import React from "react";
import clsx from "clsx";

export default function Container({ children, className, ...props }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={clsx("flex flex-col items-center justify-center h-full w-2/3 max-sm:w-full p-5", className)} {...props}>
            {children}
        </div>
    )

}