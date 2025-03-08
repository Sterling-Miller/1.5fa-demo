import { Server } from "socket.io";

let io: Server | null = null;

export function getSocketInstance() {
  return io;
}

export function initializeSocket(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    console.log("WebSocket server started");

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
    });
  }
}