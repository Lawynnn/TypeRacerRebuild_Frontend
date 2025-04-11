"use client";
import React from "react";
import useAPI from "@/hooks/useAPI";

export default function Logout() {
    const { logout } = useAPI();

    React.useEffect(() => {
        logout().then(data => {
            console.log(data);
            window.location.href = `/auth`;
        }).catch(err => {
            console.error(err);
        });
    }, [])
    return (
        <></>
    )
}