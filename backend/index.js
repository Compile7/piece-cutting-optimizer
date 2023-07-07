const httpServer = require("http").createServer();

const PORT = process.env.PORT || 3002
const oneDAlgo = require('../algorithm/1Dalgorithm');
const twoDAlgo = require('../algorithm/2Dalgorithm');
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
  let result;
  if(inputs?.cuts) {
    result = oneDAlgo(inputs.cuts, inputs.stocks)
  } else {
    console.log("sheets");
    result = twoDAlgo(inputs.sheets , inputs.stocks)
  }
  io.emit("message", result);
}

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running at ${PORT}`);
});
