import Cookies from "js-cookie";
import { useEffect } from "react";
import { useLocation } from "react-router";

export const ClearCookie = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/login' || location.pathname === '/register') {
            console.log(location.pathname)
            Cookies.remove('token')
        }
    }, [location.pathname])

    return null
}

export default ClearCookie;