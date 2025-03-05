import axios from "axios";
import SERVER_URL from "./envVariables";
const serverAPI = axios.create({
  baseURL: SERVER_URL,
});

export default serverAPI;
