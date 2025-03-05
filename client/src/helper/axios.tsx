import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const serverAPI = axios.create({
  baseURL: process.env.VITE_SERVER_URL,
});

export default serverAPI;
