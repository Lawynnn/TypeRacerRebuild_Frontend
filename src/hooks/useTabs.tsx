"use client";
import { SocketInstance } from "@/app/types/socketEventTypes";
import React from "react";

const TabContext = React.createContext<{
    activeTab: number;
    setActiveTab: (tab: number, data: Object) => void;
    data: any;
}>({
    activeTab: 0,
    setActiveTab: () => {},
    data: {},
});

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeTab, setTab] = React.useState<number>(0);
    const [data, setData] = React.useState<Object>({});

    function setActiveTab(tab: number, data: Object) {
        setTab(tab);
        setData(data);
    }

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab, data }}>
            {children}
        </TabContext.Provider>
    );
};

export const useTabs = () => {
    return React.useContext(TabContext);
};