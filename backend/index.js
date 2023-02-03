const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    console.log(msg)
    io.emit("message", msg);
  });
});

httpServer.listen(3001, () => {
  console.log(`Socket.IO server running at http://localhost:3001/`);
});
