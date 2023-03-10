import { Button, Input } from "antd";
import React, { useState } from "react";
import "./App.css";
import { drawPipe, Fabric } from "./components/fabircCanvas";
import socket from "./socket";
const App = () => {
  const [stocks, setStocks] = useState([{ size: 0, qty: 0 }]);
  const [cuts, setCuts] = useState([{ size: 0, qty: 0 }]);
  const [result, setResult] = useState({});
  const converObjectIntoArray = (objArr) => {
    let finalArr = [];
    let Arr = [];
    objArr.forEach((obj) => {
      Arr = Array(obj.qty).fill(obj.size);
      finalArr = [...finalArr, ...Arr];
    });
    return finalArr;
  };

  const handleCalculate = () => {
    socket.emit("message", { cuts: cuts, stocks: stocks });
    socket.on("message", (socket) => {
      setResult(socket);
    });

    if (result?.finalCuts?.length > 0) {
      const stockArray = converObjectIntoArray(stocks);
      result.finalCuts.forEach((val, i) => {
        const lastIndex = result.finalCuts[i].length - 1;
        const lastCutInArray = result.finalCuts[i][lastIndex];
        if (stockArray[i] !== lastCutInArray) {
          val.push(stockArray[i]);
        }
        drawPipe(val, i);
      });
    }
  };
  return (
    <div className="app">
      <div className="header">
        <img alt="logo" src={"/assets/logo.jpg"} />
      </div>
      <div className="container">
        <div class="sidebar">
          <h3>Cuts: </h3>
          <div className="stock-div">
            {cuts.map((val, i) => (
              <div className="inputs" key={`cuts_${i}`}>
                <Input
                  id="cuts-size"
                  placeholder="Size"
                  type="number"
                  required
                  onChange={(e) => {
                    cuts[i]["size"] = Number(e.target.value);
                    setCuts(cuts);
                  }}
                />
                <Input
                  placeholder="Qauntity"
                  type="number"
                  required
                  onChange={(e) => {
                    cuts[i]["qty"] = Number(e.target.value);
                    setCuts(cuts);
                  }}
                />
                <Button
                  id="deletebtn"
                  disabled={i === 0}
                  onClick={() => {
                    cuts.splice(i, 1);
                    setStocks([...cuts]);
                  }}
                >
                  <i class="far fa-trash-alt"></i>
                </Button>
              </div>
            ))}
            <Button
              id="addbutton"
              onClick={() => {
                setCuts([...cuts, { size: 0, qty: 0 }]);
              }}
            >
              <i class="fas fa-plus"></i>
            </Button>
          </div>
          <h3>Stock: </h3>
          <div className="stock-div">
            {stocks.map((val, i) => (
              <div className="inputs" key={`stock_${i}`}>
                <Input
                  type="number"
                  required
                  placeholder="Size"
                  onChange={(e) => {
                    stocks[i]["size"] = Number(e.target.value);
                    setStocks(stocks);
                  }}
                />
                <Input
                  type="number"
                  required
                  placeholder="Qauntity"
                  onChange={(e) => {
                    stocks[i]["qty"] = Number(e.target.value);
                    setStocks(stocks);
                  }}
                />
                <Button
                  id="deletebtn"
                  disabled={i === 0}
                  onClick={() => {
                    stocks.splice(i, 1);
                    setStocks([...stocks]);
                  }}
                >
                  <i class="far fa-trash-alt"></i>
                </Button>
              </div>
            ))}
            <Button
              id="addbutton"
              onClick={() => {
                setStocks([...stocks, { size: 0, qty: 0 }]);
              }}
            >
              <i class="fas fa-plus"></i>
            </Button>
          </div>
          <div className="btn-cal">
            <Button onClick={() => handleCalculate()}> Calculate </Button>
          </div>
        </div>

        <div class="main">
          <div className="canvas-div">
            <Fabric />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
