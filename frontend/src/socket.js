import { io } from "socket.io-client";

const URL = "https://piece-cutting-optimizer-backend-dev.onrender.com";
// const URL = "http://localhost:3002";
const socket = io(URL);

export default socket;
