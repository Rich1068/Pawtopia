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

    if (originalRequest.url?.includes("/login")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        // Call refresh token API (token is automatically sent via cookies)
        await axios.post(
          `${SERVER_URL}/api/refresh-token`,
          {},
          { withCredentials: true }
        );
        console.log("Token refreshed successfully");

        // Retry the original request
        return serverAPI(originalRequest);
      } catch (refreshError) {
        if (globalLogout) {
          console.warn("Session expired, logging out...");
          globalLogout(); // Only log out if user was authenticated
        } else {
          console.warn("No active session, skipping logout.");
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default serverAPI;
