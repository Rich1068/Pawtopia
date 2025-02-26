import axios from "axios";

const serverAPI = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export default serverAPI;
