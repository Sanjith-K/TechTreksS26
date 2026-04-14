"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUserState] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("be1_user");
        if (stored) setUserState(JSON.parse(stored));
    }, []);

    function setUser(u) {
        setUserState(u);
        if (u) {
            localStorage.setItem("be1_user", JSON.stringify(u));
        } else {
            localStorage.removeItem("be1_user");
        }
    }

    const value = useMemo(() => {
        const email = user?.email || "";
        return {
            user,
            isSignedIn: !!user,
            isNYU: email.toLowerCase().endsWith("@nyu.edu"),
            setUser,
        };
    }, [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}