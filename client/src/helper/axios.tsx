import axios from "axios";
import SERVER_URL from "./envVariables";
import { globalLogout } from "../context/AuthContext";

const serverAPI = axios.create({
  baseURL: SERVER_URL,
});
serverAPI.interceptors.response.use(
  (response) => response, // If successful, return response
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        // Call refresh token API (token is automatically sent via cookies)
        await axios.post(
          `${SERVER_URL}/api/refresh-token`,
          {},
          { withCredentials: true }
        );
        console.log("refreshed");
        // Retry the original request
        return serverAPI(originalRequest);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (refreshError) {
        console.error("Refresh token expired, logging out...");
        if (globalLogout) globalLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default serverAPI;
