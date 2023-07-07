import { Button, Input, Form } from "antd";
import React, { useEffect, useState } from "react";
import "./App.css";
import { drawPipe, Fabric } from "./components/Canvas/fabircCanvas";
import socket from "./socket";
import { Spin} from 'antd';
import ComponentHeader from "./components/ComponentHeader/componentHeader";
import { SettingsItems, ShowDeleteConfirm } from './components/constants';
import Table from "./components/Table";
import {
  WindowsOutlined,
  BoxPlotOutlined
} from '@ant-design/icons';



const App = () => {
  const [stocks, setStocks] = useState([{ size: 0, qty: 0 }]);
  const [cuts, setCuts] = useState([{ size: 0, qty: 0 }]);
  const [twoDStocks, settwoDStocks] = useState([{ length: 0,breadth: 0, qty: 0 }]);
  const [sheets, setSheets] = useState([{ length: 0, breadth: 0, qty: 0 }]);
  const [result, setResult] = useState({});
  const [loading, setLoading ] = useState(false);
  const [cutsstocksloading, setCutsStocksLoading ] = useState({cuts: false, stocks: false});
  const [dimension, setDimension] = useState("1D");
 
  const converObjectIntoArray = (objArr) => {
    let finalArr = [];
    let Arr = [];
    objArr.forEach((obj) => {
      dimension === "1D" ? Arr = Array(obj.qty).fill(obj.size) : Arr = Array(obj.qty).fill([obj.length,obj.breadth]);
      finalArr = [...finalArr, ...Arr];
    });
    return finalArr;
  };

  useEffect(() => {
    socket.on("message", (socket) => {
      (socket?.finalCuts?.length > 0 || socket?.finalSheets?.length > 0) && setResult(socket);
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
        
         drawPipe(val, i, "1D", 0, 0);
      });
    } else if (result?.finalSheets?.length > 0) {
      setLoading(false);
      const stockArray = converObjectIntoArray(twoDStocks);
      let totalLength = 0;
      result.finalSheets.forEach((val, i) => {
        drawPipe(val, i, "2D", stockArray[i]?.[0], 
        i === 0 ? stockArray[i]?.[1] : stockArray[i]?.[1],  
        totalLength + (i * 20)
        );
        totalLength = stockArray[i]?.[1] + totalLength;
      });
    }

  },[result])

  const handleCalculate = () => {
    setLoading(true);
    dimension === "1D" ? (cuts.length > 0 && stocks.length > 0 
      && socket.emit("message", { cuts: cuts, stocks: stocks })) :
      (sheets.length > 0 && twoDStocks.length > 0 
        && socket.emit("message", { sheets: sheets, stocks: twoDStocks })) 
    ;
    
  };
  const handleCancel = () => {
    setLoading(false);
  }
  const handleOnClick = () => {
    let stocksLength = 0;
    let cutsLength = 0;
    stocks.map((s) => stocksLength = stocksLength + s.size*s.qty ) 
    cuts.map((s) => cutsLength = cutsLength + s.size*s.qty ) 
    if (cutsLength > stocksLength){
      ShowDeleteConfirm(handleCalculate, handleCancel)
    } else {
      handleCalculate()
    }
  }


  
  const handleDelete = (objArr , i, loadingObject) => {
    setCutsStocksLoading(loadingObject);
    dimension === "1D" ? (loadingObject.cuts ? setCuts([]) : setStocks([])) : 
                        (loadingObject.cuts ? setSheets([]) : settwoDStocks([]));
    objArr.splice(i, 1);
    const splicedArr = objArr;
   setTimeout(() => { 
    dimension === "1D" ? (loadingObject.cuts ? setCuts([...splicedArr]) : setStocks([...splicedArr])) : 
                        (loadingObject.cuts ? setSheets([...splicedArr]) : settwoDStocks([...splicedArr]))  ; 
    setCutsStocksLoading({cuts : false, stocks: false});
  }, 1000)
    
  }

  const calculateCanvasWidth = (stocks) => {
    let maxLength = 0;
    stocks.map((stk) => {
      if ((dimension === "1D" ? stk?.size : stk?.length) > maxLength) {
        maxLength = dimension === "1D" ? stk?.size : stk?.length
      }
    })
    return maxLength;
  }

  const calculateCanvasHeight = (stocks) => {
    let maxLength = 0;
    if(dimension === "1D"){
      stocks.map((stk) => {
      if (stk?.qty > maxLength) {
        maxLength =  stk?.qty
      }
    })} else {
      stocks?.map((stk, i) => {
        
          maxLength = (stk.qty * stk.breadth) + maxLength + ((i+1)*  40)
        
      })
    }
    return maxLength;
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
        <ComponentHeader heading="Dimensions" endIcon="downArrow" menuItems={[
          {
      label: '1D',
      key: "1",
      icon: <BoxPlotOutlined />,
      onClick: () => {setDimension("1D")}
    },
    {
      label: '2D',
      key: "2",
      icon: <WindowsOutlined />,
      onClick: () => setDimension("2D")

    }]}/>
          <Form>
          <h3 className="heading">Stock: </h3>
          <div className="stock-div">
          <Spin spinning={cutsstocksloading.stocks} size="large" className="cuts-stock-spin">
            <div >
            {!cutsstocksloading.stocks && <div className="field-label-div">
                <div className="label-div">
              <label className="field-label">Length</label>
              </div>
              {dimension === "2D" && <div className="label-div">
              <label className="field-label">Breadth</label>
              </div>}
              <div className="label-div">
              <label className="field-label">Quantity</label>
              </div>
              </div>}
            {(dimension === "1D" ? stocks : twoDStocks).map((val, i) => (
              <div className="inputs" key={`stock_${i}`}>
                <Input
                  className="input-field"
                  type="number"
                  required
                  placeholder="Size"
                  defaultValue={dimension === "1D" ? val?.size : val?.length}
                  onChange={(e) => {
                    if(dimension === "1D")
                    {stocks[i]["size"] = Number(e.target.value);
                    setStocks(stocks);}
                    else {
                      {twoDStocks[i]["length"] = Number(e.target.value);
                    settwoDStocks(twoDStocks);}
                    }
                  }}
                />
                 {dimension === "2D" && <Input
                  className="input-field"
                  type="number"
                  required
                  placeholder="Size"
                  defaultValue={val?.breadth}
                  onChange={(e) => {
                    twoDStocks[i]["breadth"] = Number(e.target.value);
                    settwoDStocks(twoDStocks);
                  }}
                />}
                <Input
                className="input-field"
                label="Length"
                  type="number"
                  required
                  placeholder="Quantity"
                  defaultValue={val?.qty}
                  onChange={(e) => {
                  if(dimension === "1D")
                  {
                  stocks[i]["qty"] = Number(e.target.value);
                    setStocks(stocks);}
                    else {
                      twoDStocks[i]["qty"] = Number(e.target.value);
                    settwoDStocks(twoDStocks);
                    }
                  }}
                />
                <Button
                  id="deletebtn"
                  disabled={dimension === "1D" ?  stocks.length === 1 : twoDStocks.length === 1}
                  onClick={() => {
                    dimension === "1D" ? handleDelete(stocks,i,{stocks:true, cuts: false}) :
                    handleDelete(twoDStocks,i,{stocks:true, cuts: false})
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
                dimension === "1D" ? setStocks([...stocks, { size: 0, qty: 0 }]) :
                settwoDStocks([...twoDStocks, { length: 0, breadth: 0, qty: 0 }]);
              }}
            >
              <i class="fas fa-plus"></i>
            </Button>}
          </div>
          <h3 className="heading">{dimension === "1D" ? "Cuts:" : "Sheets:" }</h3>
          <div className="stock-div">
            <Spin spinning={cutsstocksloading.cuts} size="large" className="cuts-stock-spin">
            <div>
            {!cutsstocksloading.cuts && <div className="field-label-div">
                <div className="label-div">
              <label className="field-label">Length</label>
              </div>
              {dimension === "2D" && <div className="label-div">
              <label className="field-label">Breadth</label>
              </div>}
              <div className="label-div">
              <label className="field-label">Quantity</label>
              </div>
              </div>}
            {(dimension === "1D" ? cuts : sheets).map((val, i) => (
              <div className="inputs" key={`cuts_${i}`}>

                <Input
                className="input-field"
                  id={i}
                  name={i}
                  placeholder="Size"
                  type="number"
                  defaultValue={dimension === "1D" ? val?.size : val?.length}                 
                  onChange={(e) => {
                    if(dimension === "1D"){
                    cuts[i]["size"] = Number(e.target.value);
                    setCuts(cuts);
                    } else {
                      sheets[i]["length"] = Number(e.target.value);
                      setCuts(sheets);
                    }
                  }}
                />
                {dimension === "2D" && <Input
                  className="input-field"
                  type="number"
                  required
                  placeholder="Size"
                  defaultValue={val?.breadth}
                  onChange={(e) => {
                    sheets[i]["breadth"] = Number(e.target.value);
                    setSheets(sheets);
                  }}
                />}
                <Input
                id={i}
                className="input-field"
                  placeholder="Quantity"
                  type="number"
                  required
                  defaultValue={val?.qty}
                  onChange={(e) => {
                    if(dimension === "1D")
                    {
                    cuts[i]["qty"] = Number(e.target.value);
                      setCuts(cuts);}
                      else {
                        sheets[i]["qty"] = Number(e.target.value);
                      setSheets(sheets);
                      }
                  }}
                />
                <Button
                  id="deletebtn"
                  disabled={ dimension === "1D" ? cuts.length === 1 : sheets.length === 1}
                  onClick={() => {
                    dimension === "1D" ? handleDelete(cuts,i, {cuts: true, stocks: false}) : 
                    handleDelete(sheets,i,{stocks:false, cuts: true});
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
                dimension === "1D" ? setCuts([...cuts, { size: 0, qty: 0 }]) : 
                setSheets([...sheets, { length: 0,breadth: 0, qty: 0 }]);
              }}
            >
              <i class="fas fa-plus"></i>
            </Button>}
          </div>
         
          <div className="btn-cal">
            <Button
            onClick={() => handleOnClick()} >Calculate  <i class="fas fa-play"></i></Button>
          </div>
          </Form>
        </div>

        <div class="main">
            <ComponentHeader  endIcon="setting" menuItems={SettingsItems}/>
          <div className="canvas-div">
            <Fabric loading={loading} 
            canvasWidth={calculateCanvasWidth(dimension === "1D" ? stocks : twoDStocks)} 
            canvasHeight={calculateCanvasHeight(dimension === "1D" ? stocks : twoDStocks)} 
            dimension= {dimension}/>
          </div>
        </div>

        <div class="sidebar left-sidebar" style={{zIndex: 1}}>
            <div className="table-container">
              <h3>Unable to fit pieces:</h3>
              <Table list = {result?.unabletofit} dimension={dimension}/>
              {/* <h3>Fit Pieces:</h3>
              <Table list = {result?.finalCuts} /> */}
            </div>
        </div>
      </div>
        </Spin>
    </div>
  );
};

export default App;
