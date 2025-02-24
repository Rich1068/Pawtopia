import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import type { User, AuthContextType } from "../types/Types";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!user;

    const verifyToken = async () => {
        try {
            const { data } = await axios.post("http://localhost:8000/api/verify-token",
                {}, 
                { withCredentials: true } 
              );
            console.log(data)
            setUser(data.verify)
            return {success: true, user: data.verify}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch(err) {
            setUser(null)

        } finally {
            setLoading(false)
        }
    }

    const login = async () => {
        await verifyToken();
        return isAuthenticated
    }
    const logout = () => {
        Cookie.remove("token");
        setUser(null);
    };

    useEffect(() => {
        verifyToken();
        
    }, [])

    return (
        <AuthContext.Provider value={{user, isAuthenticated, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}