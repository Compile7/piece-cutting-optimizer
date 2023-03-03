import { Button, Input } from "antd";
import React, { useEffect, useState } from "react";
import "./App.css";
import { drawPipe, Fabric } from "./components/fabircCanvas";
import socket from "./socket";

function App() {
  const [stocks, setStocks] = useState([{ size: 0, qty: 0}]);
  const [cuts, setCuts] = useState([{ size: 0, qty: 0 }]);
  const [result, setResult] = useState({})


const converObjectIntoArray = ( objArr) => {
  let finalArr = [];
  let Arr = []
  objArr.map((obj) => {
      Arr = Array(obj.qty).fill(obj.size)
      finalArr = [...finalArr, ...Arr]
  });
  return finalArr;
}
  
const handleCalculate = () => {
  socket.emit("message", {cuts:cuts,stocks:stocks});
  socket.on('message', (socket) => {
    setResult(socket)
  });

  if(result?.finalCuts?.length > 0)
  {const stockArray = converObjectIntoArray(stocks) 
    result.finalCuts.map((val, i) => {
      const lastIndex = result.finalCuts[i].length - 1;
      const lastCutInArray = result.finalCuts[i][lastIndex];
      if(stockArray[i] !== lastCutInArray){
        val.push(stockArray[i])
      };
      drawPipe(val, i)
    })
  }
}
  return (
    <div className="App">
      <div id="header">
        <Button onClick={() => handleCalculate()}> Calculate </Button>
      </div>
      <div className="container">
        <div id="sidebar">
          <h3>Cuts: </h3>
          <div className="stock-div">
            {cuts.map((val, i) => (
              <div className="inputs">
                <Input
                id="cuts-size"
                  placeholder="Size"
                  type="number"
                  required
                  // value={val.size}
                  onChange={(e) => {
                    cuts[i]["size"] = Number(e.target.value);
                    setCuts(cuts);
                  }}
                />
                <Input
                  placeholder="Qauntity"
                  type="number"
                  required
                  // value={val["qty"]}
                  onChange={(e) => {
                    cuts[i]["qty"] = Number(e.target.value);
                    setCuts(cuts);
                  }}
                />
              </div>
            ))}
            <Button
              onClick={() => {
                setCuts([...cuts, { size: 0, qty: 0 }]);
              }}
            >
              Add
            </Button>
          </div>
        <h3>Stock: </h3>
          <div className="stock-div">
            {stocks.map((val, i) => (
              <div className="inputs">
                <Input
                type="number"
                required
                  placeholder="Size"
                  // value={val["size"]}
                  onChange={(e) => {
                    stocks[i]["size"] = Number(e.target.value);
                    setStocks(stocks);
                  }}
                />
                <Input
                type="number"
                required
                  placeholder="Qauntity"
                  // value={val["qty"]}
                  onChange={(e) => {
                    stocks[i]["qty"] = Number(e.target.value);
                    setStocks(stocks);
                  }}
                />
              </div>
            ))}
            <Button
              onClick={() => {
                setStocks([...stocks, { size: 0, qty: 0 }]);
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
