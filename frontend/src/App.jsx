import { Button, Input, Form } from "antd";
import React, { useEffect, useState } from "react";
import "./App.css";
import { drawPipe, Fabric } from "./components/fabircCanvas";
import socket from "./socket";
import { Spin} from 'antd';
const App = () => {
  const [stocks, setStocks] = useState([{ size: 0, qty: 0 }]);
  const [cuts, setCuts] = useState([{ size: 0, qty: 0 }]);
  const [result, setResult] = useState({});
  const [loading, setLoading ] = useState(false);
  const [cutsstocksloading, setCutsStocksLoading ] = useState({cuts: false, stocks: false});
 
  const converObjectIntoArray = (objArr) => {
    let finalArr = [];
    let Arr = [];
    objArr.forEach((obj) => {
      Arr = Array(obj.qty).fill(obj.size);
      finalArr = [...finalArr, ...Arr];
    });
    return finalArr;
  };

  useEffect(() => {
    socket.on("message", (socket) => {
      socket?.finalCuts?.length > 0 && setResult(socket);
    });
    if (result?.finalCuts?.length > 0) {
      setLoading(false);
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
  },[result])

  const handleCalculate = () => {
    setLoading(true);
    cuts.length > 0 && stocks.length > 0 && socket.emit("message", { cuts: cuts, stocks: stocks });
    
  };
  
  const handleDelete = (objArr , i, loadingObject) => {
    setCutsStocksLoading(loadingObject);
    loadingObject.cuts ? setCuts([]) : setStocks([]);
    objArr.splice(i, 1);
    const splicedArr = objArr;
   setTimeout(() => { 
    loadingObject.cuts ? setCuts([...splicedArr]) : setStocks([...splicedArr]); 
    setCutsStocksLoading({cuts : false, stocks: false});
  }, 1000)
    
  }
  return (
    <div className="app">
      <div className="header">
        <img alt="logo" src={"/assets/logo.jpg"} />
        <h3 className="appname"> Cut Genius </h3>
        <div className="dropdown-placeholder" ></div>
      </div>
      <Spin  spinning={loading}> 
      <div className="container">
       
        <div class="sidebar">
          <Form>
          <h3>Cuts: </h3>
          <div className="stock-div">
            <Spin spinning={cutsstocksloading.cuts} size="large" className="cuts-stock-spin">
            <div>
            {cuts.map((val, i) => (
              <div className="inputs" key={`cuts_${i}`}>

                <Input
                  id={i}
                  name={i}
                  placeholder="Size"
                  type="number"
                  defaultValue={val?.size}                 
                  onChange={(e) => {
                    cuts[i]["size"] = Number(e.target.value);
                    setCuts(cuts);
                  }}
                />
                <Input
                id={i}
                  placeholder="Quantity"
                  type="number"
                  required
                  defaultValue={val?.qty}
                  onChange={(e) => {
                    cuts[i]["qty"] = Number(e.target.value);
                    setCuts(cuts);
                  }}
                />
                <Button
                  id="deletebtn"
                  disabled={cuts.length === 1}
                  onClick={() => {
                    handleDelete(cuts,i, {cuts: true, stocks: false});
                  }}
                >
                  <i class="fa fa-minus"></i>
                </Button>
              </div>
            ))}</div>
            </Spin>
            { !cutsstocksloading.cuts && <Button
              id="addbutton"
              onClick={() => {
                setCuts([...cuts, { size: 0, qty: 0 }]);
              }}
            >
              <i class="fas fa-plus"></i>
            </Button>}
          </div>
          <h3>Stock: </h3>
          <div className="stock-div">
          <Spin spinning={cutsstocksloading.stocks} size="large" className="cuts-stock-spin">
            <div>
            {stocks.map((val, i) => (
              <div className="inputs" key={`stock_${i}`}>
                <Input
                  type="number"
                  required
                  placeholder="Size"
                  defaultValue={val?.size}
                  onChange={(e) => {
                    stocks[i]["size"] = Number(e.target.value);
                    setStocks(stocks);
                  }}
                />
                <Input
                  type="number"
                  required
                  placeholder="Quantity"
                  defaultValue={val?.qty}
                  onChange={(e) => {
                    stocks[i]["qty"] = Number(e.target.value);
                    setStocks(stocks);
                  }}
                />
                <Button
                  id="deletebtn"
                  disabled={stocks.length === 1}
                  onClick={() => {
                    handleDelete(stocks,i,{stocks:true, cuts: false})
                  }}
                >
                  <i class="fa fa-minus"></i>
                </Button>
              </div>
            ))}
            </div>
            </Spin>
           {!cutsstocksloading.stocks && <Button
              id="addbutton"
              onClick={() => {
                setStocks([...stocks, { size: 0, qty: 0 }]);
              }}
            >
              <i class="fas fa-plus"></i>
            </Button>}
          </div>
          <div className="btn-cal">
            <Button onClick={() => handleCalculate()}> Calculate <i class="fas fa-play"></i></Button>
          </div>
          </Form>
        </div>

        <div class="main">
          <div className="canvas-div">
            <Fabric loading={loading}/>
          </div>
        </div>

        <div class="sidebar left-sidebar" style={{zIndex: 1}}>
            <div>
              <h3>Unable to fit pieces:</h3>
              <div>{result?.unabletofit?.toString() || "N/A"}</div>
            </div>
        </div>
      </div>
        </Spin>
    </div>
  );
};

export default App;
