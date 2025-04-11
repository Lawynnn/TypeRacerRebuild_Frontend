"use client";
import ErrorPopup from "@/components/ErrorPopup";
import React from "react";

type ErrorContextType = {
    error: string | null;
    setError: (error: string | null) => void;
}

const ErrorContext = React.createContext<ErrorContextType | null>(null);

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [error, setError] = React.useState<string | null>(null);

    return (
        <ErrorContext.Provider value={{ error, setError }}>
            <ErrorPopup onClose={() => setError(null)} error={error} show={error != null} />
            {children}
        </ErrorContext.Provider>
    );
}

export const useError = () => {
    const context = React.useContext(ErrorContext);
    if (!context) {
        throw new Error("useError must be used within an ErrorProvider");
    }
    return context;
}