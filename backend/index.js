const httpServer = require("http").createServer();

const PORT = process.env.PORT || 3002
const oneDAlgo = require('../algorithm/1Dalgorithm');
const io = require("socket.io")(httpServer
  , {
  cors: {
    origin: '*',
  },}
);

io.on("connection", (socket) => {
  socket.on("message", oneDAlgoResult);
});

const oneDAlgoResult = (inputs) => {
  const result = oneDAlgo(inputs.cuts, inputs.stocks)
  io.emit("message", result);
}

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running at ${PORT}`);
});
