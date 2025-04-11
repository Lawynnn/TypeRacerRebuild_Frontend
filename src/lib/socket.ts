import { io, Socket } from "socket.io-client";
import config from "@/config";
import { SocketInstance } from "@/app/types/socketEventTypes";

let socket: SocketInstance | null = null;

export const getSocket = () => {
    if (!socket) {
        socket = io(config.socket_url, {
            withCredentials: true,
        }) as SocketInstance;
    }
    return socket;
};
