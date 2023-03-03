import { Button, Input } from "antd";
import React, { useEffect } from "react";
import "./App.css";
import { drawRect, Fabric } from "./components/fabircCanvas";
// import socket from "./socket";

function App() {
  const [stocks, setStocks] = React.useState([{ size: "", qty: "" }]);
  // Please uncomment for socket testing
  // useEffect(() => {
  //   socket.emit("message", {cuts: [ {size: 45, qty:1}, {size: 25, qty:1}, {size: 20, qty:3}, {size: 15, qty:2}, {size: 35, qty:1} ],
  //   stocks: [{size: 89, qty:2}]});
  // });
  return (
    <div className="App">
      <div id="header">
        <Button onClick={() => drawRect()}> Calculate </Button>
      </div>
      <div className="container">
        <div id="sidebar">
          <h3>Stock: </h3>
          <div className="stock-div">
            {stocks.map((val, i) => (
              <div className="inputs">
                <Input
                  placeholder="Size"
                  value={val["size"]}
                  onChange={(e) => {
                    stocks[i]["size"] = e.target.value;
                    setStocks(stocks);
                  }}
                />
                <Input
                  placeholder="Qauntity"
                  value={val["qty"]}
                  onChange={(e) => {
                    stocks[i]["qty"] = e.target.value;
                    setStocks(stocks);
                  }}
                />
              </div>
            ))}
            <Button
              onClick={() => {
                setStocks([...stocks, { size: "", qty: "" }]);
              }}
            >
              Add
            </Button>
          </div>
        </div>
        <div className="canvas-div">
          <Fabric />
        </div>
      </div>
    </div>
  );
}

export default App;
