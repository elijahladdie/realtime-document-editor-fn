// src/socket.js
import { io } from 'socket.io-client';

// Initialize the WebSocket connection (replace the URL with your backend URL)
export const socket = io('http://localhost:4000'); // or the correct server URL

