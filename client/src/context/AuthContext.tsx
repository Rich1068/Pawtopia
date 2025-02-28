import { createContext, useState, useEffect, ReactNode } from "react";
import serverAPI from "../helper/axios";
import type {User, AuthContextType } from "../types/Types";
import LoadingPage from "../components/LoadingPage/LoadingPage";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!user;

    const verifyToken = async () => {
        try {
            const { data } = await serverAPI.post("/api/verify-token", {}, { withCredentials: true });

            if (!data.verify) {
                setUser(null);
                return { success: false };
            }

            const response = await serverAPI.get<{user: User}>("/api/get-user", { withCredentials: true });
            console.log(response.data.user)
            setUser(response.data.user);

            return { success: true, user: response.data.user };
        } catch (error) {
            console.error("Failed to verify token or fetch user:", error);
            setUser(null);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const login = async () => {
        await verifyToken();
        return isAuthenticated
    }
    const logout = async () => {
        try {
            serverAPI.post('/api/logout', {}, {withCredentials: true})
            setUser(null);
        } catch (error) {
            console.log(error)
        }

    };

    useEffect(() => {
        verifyToken();
        
    }, [])
    if (loading) return <LoadingPage fadeOut={false} />;
    return (
        <AuthContext.Provider value={{user, isAuthenticated, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}