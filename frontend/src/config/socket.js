import { io } from "socket.io-client";
import VITE_BACKEND_URL from "../Libs/env";

export const socket = io(VITE_BACKEND_URL); 