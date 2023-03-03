import { io } from "socket.io-client";

const URL = "https://piece-cutting-optimizer-backend.onrender.com/";
const socket = io(URL);

export default socket;
