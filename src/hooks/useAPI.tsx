"use client";
import React from "react";
import config from "@/config";
import { APIResponse, CacheUser, User } from "@/app/types/apiTypes";

export default function useAPI() {
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [user, setUser] = React.useState<User | null>(null);

    const getUser = async () => {
        setLoading(true);
        const res = await fetch(`${config.backend_url}/api/profile`, {
            credentials: "include",
        });
        setLoading(false);
        if (!res.ok) {
            setUser(null);
            window.location.href = "/auth";
            throw new Error("Failed to fetch user data");
        }
        const data = await res.json() as APIResponse<User>;
        return data;
    };

    const logout = async () => {
        setLoading(true);
        const res = await fetch(`${config.backend_url}/api/logout`, {
            method: "POST",
            credentials: "include",
        });
        setLoading(false);
        if (!res.ok) {
            throw new Error("Failed to logout");
        }

        return await res.json() as APIResponse<null>;
    }

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as CacheUser;
            const now = new Date().getTime();
            const expiration = parsedUser.expiresAt as number;
            if (now > expiration) {
                localStorage.removeItem("user");
                setUser(null);
                window.location.href = "/auth";
                return;
            }
            setUser(parsedUser);
            return
        }

        getUser().then(data => {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            setError(null);
        }).catch(err => {
            setUser(null);
            localStorage.removeItem("user");
            setError(err.message);
        });
    }, []);

    return { logout, isLoading, user, error };
}