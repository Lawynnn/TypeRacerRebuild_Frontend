import { Socket } from "socket.io-client";

export type RoomCreatedEvent = {
    code: string;
    name: string;
    settings: Object;
};

export type User = {
    userId: string;
    _id: string;
    username: string;
    avatar: string;
    email?: string;
};

export type RoomUser = {
    isHost: boolean;
    joinedAt: Date;
    isBroadcast: boolean;
    user: User;
};

export type RoomMessage = {
    sender: RoomUser;
    message: string;
    timestamp: Date;
};

export type HostChangedReasons = "disconnected" | "promoted" | string;

export type SocketEvents = {
    connect: () => void;
    disconnect: () => void;
    "room-deleted": (code: string) => void;
    "host-changed": (data: {
        newHost: User;
        oldHost: User;
        reason: HostChangedReasons;
    }) => void;
    "user-disconnected": (data: {
        disconnectedUser: RoomUser;
        users: RoomUser[];
    }) => void;
    "room-error": (error: string) => void;
    "room-created": (data: RoomCreatedEvent) => void;
    "create-room": (data: {
        roomName: string;
        roomPassword?: string | undefined;
        settings?: Object | undefined;
    }) => void;
    "join-room": (data: {
        roomCode: string;
        roomPassword?: string | undefined;
    }) => void;
    "user-joined": (data: { user: RoomUser; users: RoomUser[] }) => void;
    "room-joined": (data: {
        code: string;
        name: string;
        settings: Object;
        users: RoomUser[];
    }) => void;
    "room-message": (data: RoomMessage) => void;
    "send-message": (data: { message: string }) => void;
    "start-game": () => void;
    "game-ended": (data: { reason: string, users: RoomUser[] }) => void;
    "game-started": (data: { quote: string, users: RoomUser[] }) => void;
    "game-starting": (data: { ROOM_LOAD_TIME: number, gameSettings: any }) => void;
    "game-error": (error: string) => void;
    "game-typing": (data: { letter: string; words: string[]; idx: number }) => void;
    "game-typed": (data: { userId: string, letter: string, player: any }) => void;
    "player-finished": (data: { userId: string, player: string, time: number, wpm: number, accuracy: number }) => void;
};

export type SocketInstance = Socket<SocketEvents, SocketEvents> & {
    emit: <K extends keyof SocketEvents>(
        event: K,
        ...args: Parameters<SocketEvents[K]>
    ) => void;
    on: <K extends keyof SocketEvents>(
        event: K,
        callback: SocketEvents[K]
    ) => void;
    off: <K extends keyof SocketEvents>(
        event: K,
        callback?: SocketEvents[K]
    ) => void;
};
