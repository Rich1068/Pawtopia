import { Navigate, Outlet } from "react-router";
import {verifyToken} from "../helpers/auth"
import { FC, useEffect, useState } from "react";

type User = {
    success: boolean;
    user: {
        role: 'user' | 'admin'
    };
    message?: undefined;
}
type Fail = {
    success: boolean;
    message: object;
    user?: undefined;
}
type UserType = User | Fail | null
export const ProtectedRoute: FC<{ allowedRoles: ('user' | 'admin')[];  }>= ({allowedRoles}) => {
    const [user, setUser] = useState<UserType>(null);  // Initialize state for the user
    const [loading, setLoading] = useState(true);
    useEffect(()=> {
        const verify = async () => {
            const user = await verifyToken();
            console.log(user)
            if(user){
            setUser(user)
            }
            setLoading(false);
        }
        verify();
    }, [])
    if (loading) {
        return <div>Loading...</div>;
      }
    if(user?.success === false || !allowedRoles.includes(user!.user!.role)){
        return <Navigate to="/login" replace />;
    }
    return <Outlet />

}

export default ProtectedRoute