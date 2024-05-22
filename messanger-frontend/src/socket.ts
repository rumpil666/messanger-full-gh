import { io } from "socket.io-client";

export const socket = io('http://localhost:4200/', { 'transports': ['websocket', 'polling'] });