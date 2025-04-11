export type User = {
    username: string;
    userId: string;
    email: string;
    avatar: string;
    provider: "GOOGLE" | "GITHUB" | string;
};

export type CacheUser = {
    expiresAt: number;
} & User;

export type APIResponse<T> = {
    sucess: boolean;
    message?: string;
    error?: string;
} & T;
