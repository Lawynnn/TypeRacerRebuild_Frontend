"use client";
import React, { ReactNode } from "react";
import { SocketInstance } from "@/app/types/socketEventTypes";
import { getSocket } from "@/lib/socket";

const SocketContext = React.createContext<{
    socket: SocketInstance;
    isConnected: boolean;
}>({ socket: getSocket(), isConnected: false });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const socket = getSocket();
    const [isConnected, setIsConnected] = React.useState(socket.connected);

    React.useEffect(() => {
        const handleConnect = () => {
            // console.log("Socket connected", socket.id);
            setIsConnected(true);
        }

        const handleDisconnect = () => {
            // console.log("Socket disconnected");
            setIsConnected(false);
        }

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
        };
    }, [socket]);

    return (
        <SocketContext.Provider
            value={{ socket, isConnected }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return React.useContext(SocketContext);
};
