import axios from "axios";
import Cookie from 'js-cookie';

export const verifyToken = async () => {
    const token = Cookie.get('token')
    if(!token) {
        return { success: false, message: "No Token"}
    }
    try {
        const response = await axios.post("http://localhost:8000/api/verify-token", {
            token
        })
        console.log(response)
        return {success: true, user: response.data.verify}
    } catch(err) {
        return { success: false, message: err || "Token verification failed" };
    }
}