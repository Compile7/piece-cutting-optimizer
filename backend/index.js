const httpServer = require("http").createServer();

const port = process.env.PORT || 3002
const oneDAlgo = require('../algorithm/1Dalgorithm');
const io = require("socket.io")(httpServer
  // , {
  // cors: {
  //   origin: "http://localhost:3000",
  // },}
);

io.on("connection", (socket) => {
  socket.on("message", oneDAlgoResult);
});

const oneDAlgoResult = (inputs) => {
  const result = oneDAlgo(inputs.cuts, inputs.stocks)
  io.emit("message", result);
}

httpServer.listen(port, () => {
  console.log(`Socket.IO server running at ${port}`);
});
