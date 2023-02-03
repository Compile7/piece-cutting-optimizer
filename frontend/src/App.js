import React, { useEffect, useState } from "react";
import "./App.css";
import socket from "./socket";

function App() {
  const [val, setVal] = useState("");
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    socket.on("message", function (msg) {
      const newMesgs = [...messages];
      newMesgs.push(msg);
      setMessages(newMesgs);
    });
  });
  return (
    <div className="App">
      <ul id="messages">
        {messages.map((msg, i) => (
          <li key={`msg_${i}`}>{msg}</li>
        ))}
      </ul>
      <div className="form">
        <input
          id="input"
          autoComplete="off"
          value={val}
          onChange={(e) => {
            setVal(e.target.val);
          }}
        />
        <button
          id={"event_btn"}
          onClick={() => {
            socket.emit("message", val);
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
