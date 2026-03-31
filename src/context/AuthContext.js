"use client";

import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

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