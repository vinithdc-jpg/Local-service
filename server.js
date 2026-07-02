const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-room", ({ roomId, userId, username, role }) => {
      socket.join(roomId);
      socket.data = { roomId, userId, username, role };

      socket.to(roomId).emit("receive-message", {
        id: `system-${Date.now()}`,
        senderId: "system",
        senderName: "System",
        text: `${username || "A user"} joined the chat`,
        timestamp: new Date(),
      });
    });

    socket.on("send-message", (payload) => {
      const targetRoom = payload.roomId || socket.data?.roomId;
      if (!targetRoom) return;

      io.to(targetRoom).emit("receive-message", {
        ...payload,
        timestamp: payload.timestamp || new Date(),
      });
    });

    socket.on("typing", ({ roomId, userId, isTyping }) => {
      socket.to(roomId).emit("typing", { userId, isTyping });
    });

    socket.on("disconnect", () => {
      // no-op
    });
  });

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
