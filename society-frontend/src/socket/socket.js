import { io } from "socket.io-client";

const SOCKET_URL =
  "https://society-managment-app.onrender.com";

export const socket =
  io(SOCKET_URL, {

    autoConnect: true,

    transports: [
      "websocket"
    ]

  });