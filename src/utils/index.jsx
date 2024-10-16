import { io } from 'socket.io-client';

const serverUrl = import.meta.env.VITE_SERVER_URL;
console.log(serverUrl, "ENV")
export const socket = io(serverUrl);